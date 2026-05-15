/**
 * Tests d'intégration — GET /api/users/me
 *
 * Route protégée par requireAuth : le cookie refresh_token est vérifié
 * avant que le controller soit atteint.
 * On génère un vrai JWT signé avec le secret de test pour simuler un cookie valide.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import supertest from "supertest";
import app from "../../../index";
import prisma from "../../libs/prisma";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

// ─── Mock Prisma ──────────────────────────────────────────────────────────────
vi.mock("../../libs/prisma", () => ({
  default: {
    user: { findUnique: vi.fn() },
    token: { findFirst: vi.fn() },
  },
}));

// ─── Données de test ──────────────────────────────────────────────────────────

const request = supertest(app);

const TEST_SECRET = "test-secret-for-vitest";
const TEST_USER_ID = "uuid-abc-123";

// JWT valide signé avec le même secret que vitest.config.ts
const validJwt = jwt.sign({ sub: TEST_USER_ID }, TEST_SECRET, { expiresIn: 604800 });
// Hash SHA-256 du JWT — c'est ce que requireAuth compare avec la BDD
const validHash = crypto.createHash("sha256").update(validJwt).digest("hex");

// Token tel que prisma.token.findFirst le retournerait
const STORED_TOKEN = {
  id: 1,
  userId: TEST_USER_ID,
  tokenHash: validHash,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  createdAt: new Date(),
};

// Utilisateur tel que prisma.user.findUnique le retournerait
const FOUND_USER = {
  id: TEST_USER_ID,
  username: "testuser",
  email: "test@example.com",
  passwordHash: "$argon2id$v=19$storedHash",
  bio: null,
  profileImage: null,
  created_at: new Date("2026-01-01T00:00:00.000Z"),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("GET /api/users/me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Vérifie qu'un utilisateur connecté peut accéder à son profil
  it("should return 200 and user data without password_hash when token is valid", async () => {
    (prisma.token.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(STORED_TOKEN);
    (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(FOUND_USER);

    const res = await request
      .get("/api/users/me")
      .set("Cookie", `refresh_token=${validJwt}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("username", "testuser");
    expect(res.body.data).toHaveProperty("email", "test@example.com");
    expect(res.body.data).not.toHaveProperty("password_hash");
    expect(res.body.data).not.toHaveProperty("passwordHash");
  });

  // Vérifie que la route est inaccessible sans cookie
  it("should return 401 when no cookie is sent", async () => {
    const res = await request.get("/api/users/me");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Non authentifié");
  });

  // Vérifie qu'un JWT avec une signature invalide est rejeté
  it("should return 401 when JWT signature is invalid", async () => {
    const res = await request
      .get("/api/users/me")
      .set("Cookie", "refresh_token=invalid.jwt.token");

    expect(res.status).toBe(401);
  });

  // Vérifie qu'un token absent de la base (révoqué) est rejeté
  it("should return 401 when token is not found in database", async () => {
    (prisma.token.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const res = await request
      .get("/api/users/me")
      .set("Cookie", `refresh_token=${validJwt}`);

    expect(res.status).toBe(401);
  });

  // Vérifie qu'un token expiré en base est rejeté
  it("should return 401 when token is expired in database", async () => {
    (prisma.token.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...STORED_TOKEN,
      expiresAt: new Date(Date.now() - 1000), // date dans le passé
    });

    const res = await request
      .get("/api/users/me")
      .set("Cookie", `refresh_token=${validJwt}`);

    expect(res.status).toBe(401);
  });

  // Vérifie que 404 est retourné si le token est valide mais l'utilisateur introuvable
  it("should return 404 when token is valid but user does not exist in database", async () => {
    (prisma.token.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(STORED_TOKEN);
    (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const res = await request
      .get("/api/users/me")
      .set("Cookie", `refresh_token=${validJwt}`);

    expect(res.status).toBe(404);
  });
});
