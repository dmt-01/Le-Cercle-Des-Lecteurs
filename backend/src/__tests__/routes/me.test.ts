/**
 * Tests d'intégration — GET /api/users/me
 *
 * Route protégée par requireAuth : le header Authorization: Bearer <access_token>
 * est vérifié avant que le controller soit atteint.
 * L'access token est stateless — pas de lookup en base dans requireAuth.
 * On génère un vrai JWT signé avec le secret de test pour simuler un token valide.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import supertest from "supertest";
import app from "../../../index";
import prisma from "../../libs/prisma";
import jwt from "jsonwebtoken";

// ─── Mock Prisma ──────────────────────────────────────────────────────────────
vi.mock("../../libs/prisma", () => ({
  default: {
    user: { findUnique: vi.fn() },
  },
}));

// ─── Données de test ──────────────────────────────────────────────────────────

const request = supertest(app);

const ACCESS_SECRET = "test-access-secret-for-vitest";
const TEST_USER_ID = "uuid-abc-123";

// Access token signé avec le même secret que vitest.config.ts
const validAccessToken = jwt.sign({ sub: TEST_USER_ID }, ACCESS_SECRET, { expiresIn: 900 });

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
    (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(FOUND_USER);

    const res = await request
      .get("/api/users/me")
      .set("Authorization", `Bearer ${validAccessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("username", "testuser");
    expect(res.body.data).toHaveProperty("email", "test@example.com");
    expect(res.body.data).not.toHaveProperty("password_hash");
    expect(res.body.data).not.toHaveProperty("passwordHash");
  });

  // Vérifie que la route est inaccessible sans header Authorization
  it("should return 401 when no Authorization header is sent", async () => {
    const res = await request.get("/api/users/me");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Non authentifié");
  });

  // Vérifie qu'un access token avec une signature invalide est rejeté
  it("should return 401 when JWT signature is invalid", async () => {
    const res = await request
      .get("/api/users/me")
      .set("Authorization", "Bearer invalid.jwt.token");

    expect(res.status).toBe(401);
  });

  // Vérifie qu'un access token expiré est rejeté
  it("should return 401 when access token is expired", async () => {
    // exp dans le passé — jwt.verify lèvera une TokenExpiredError
    const expiredToken = jwt.sign(
      { sub: TEST_USER_ID, exp: Math.floor(Date.now() / 1000) - 10 },
      ACCESS_SECRET,
    );

    const res = await request
      .get("/api/users/me")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
  });

  // Vérifie qu'un header mal formé (sans "Bearer ") est rejeté
  it("should return 401 when Authorization format is wrong", async () => {
    const res = await request
      .get("/api/users/me")
      .set("Authorization", validAccessToken); // manque le préfixe "Bearer "

    expect(res.status).toBe(401);
  });

  // Vérifie que 404 est retourné si le token est valide mais l'utilisateur introuvable
  it("should return 404 when token is valid but user does not exist in database", async () => {
    (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const res = await request
      .get("/api/users/me")
      .set("Authorization", `Bearer ${validAccessToken}`);

    expect(res.status).toBe(404);
  });
});
