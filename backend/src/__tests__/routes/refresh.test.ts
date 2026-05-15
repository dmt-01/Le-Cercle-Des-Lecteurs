/**
 * Tests d'intégration — POST /api/users/refresh
 *
 * Route protégée par requireAuth.
 * Génère un nouveau JWT et remplace l'ancien token en base via replaceForUser()
 * qui utilise prisma.$transaction — mocké pour exécuter le callback avec un
 * faux objet transaction.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import supertest from "supertest";
import app from "../../../index";
import prisma from "../../libs/prisma";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

// ─── Mock Prisma ──────────────────────────────────────────────────────────────
// $transaction est mocké pour exécuter le callback avec un faux objet transaction
vi.mock("../../libs/prisma", () => ({
  default: {
    user: { findUnique: vi.fn() },
    token: { findFirst: vi.fn() },
    $transaction: vi.fn(),
  },
}));

// ─── Données de test ──────────────────────────────────────────────────────────

const request = supertest(app);

const TEST_SECRET = "test-secret-for-vitest";
const TEST_USER_ID = "uuid-abc-123";

const validJwt = jwt.sign({ sub: TEST_USER_ID }, TEST_SECRET, { expiresIn: 604800 });
const validHash = crypto.createHash("sha256").update(validJwt).digest("hex");

const STORED_TOKEN = {
  id: 1,
  userId: TEST_USER_ID,
  tokenHash: validHash,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  createdAt: new Date(),
};

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

describe("POST /api/users/refresh", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Vérifie qu'un token valide génère un nouveau cookie et retourne les données utilisateur
  it("should return 200, set a new cookie, and return user data", async () => {
    (prisma.token.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(STORED_TOKEN);
    (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(FOUND_USER);
    // replaceForUser() appelle prisma.$transaction(callback) — on exécute le callback
    // avec un faux objet transaction contenant les méthodes nécessaires
    (prisma.$transaction as ReturnType<typeof vi.fn>).mockImplementation(async (fn) =>
      fn({
        token: {
          deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
          create: vi.fn().mockResolvedValue({ id: 2 }),
        },
      })
    );

    const res = await request
      .post("/api/users/refresh")
      .set("Cookie", `refresh_token=${validJwt}`);

    expect(res.status).toBe(200);
    // Un nouveau cookie doit être posé (token rotation)
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.headers["set-cookie"][0]).toMatch(/refresh_token=/);
    expect(res.body.data).toHaveProperty("username", "testuser");
    expect(res.body.data).not.toHaveProperty("password_hash");
    expect(res.body.data).not.toHaveProperty("passwordHash");
  });

  // Vérifie que la route est inaccessible sans cookie
  it("should return 401 when no cookie is sent", async () => {
    const res = await request.post("/api/users/refresh");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Non authentifié");
  });

  // Vérifie qu'un JWT avec une signature invalide est rejeté
  it("should return 401 when JWT signature is invalid", async () => {
    const res = await request
      .post("/api/users/refresh")
      .set("Cookie", "refresh_token=invalid.jwt.token");

    expect(res.status).toBe(401);
  });

  // Vérifie qu'un token absent de la base (révoqué) est rejeté
  it("should return 401 when token is not found in database", async () => {
    (prisma.token.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const res = await request
      .post("/api/users/refresh")
      .set("Cookie", `refresh_token=${validJwt}`);

    expect(res.status).toBe(401);
  });
});
