/**
 * Tests d'intégration — POST /api/users/signup
 *
 * Approche : supertest (vraies requêtes HTTP vers l'app Express) + mock Prisma (vi.mock).
 * Aucune base de données n'est impliquée — les appels Prisma sont interceptés.
 * argon2 est également mocké car il est intentionnellement lent (sécurité).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import supertest from "supertest";
import app from "../../../index";
import prisma from "../../libs/prisma";

// ─── Mock Prisma ──────────────────────────────────────────────────────────────
// Remplace le client Prisma par des vi.fn() — aucun appel réseau vers la BDD
vi.mock("../../libs/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    token: {
      create: vi.fn(),
    },
  },
}));

// ─── Mock argon2 ──────────────────────────────────────────────────────────────
// argon2.hash est volontairement lent (protection brute-force) — on le remplace par un stub
vi.mock("argon2", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("$argon2id$v=19$mockedHash"),
  },
}));

// ─── Données de test ──────────────────────────────────────────────────────────

const request = supertest(app);

// Payload valide réutilisé dans tous les tests
const VALID_PAYLOAD = {
  username: "testuser",
  email: "test@example.com",
  password: "MonPassword1!",
};

// Réponse simulée de prisma.user.create
const CREATED_USER = {
  id: "uuid-abc-123",
  username: "testuser",
  email: "test@example.com",
  passwordHash: "$argon2id$v=19$mockedHash",
  bio: null,
  profileImage: null,
  created_at: new Date("2026-01-01T00:00:00.000Z"),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("POST /api/users/signup", () => {
  beforeEach(() => {
    // Remet les mocks à zéro entre chaque test pour éviter les effets de bord
    vi.clearAllMocks();
  });

  // Vérifie qu'un utilisateur peut s'inscrire avec des données valides
  it("should return 201, set httpOnly cookie, and return user without password_hash", async () => {
    (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (prisma.user.create as ReturnType<typeof vi.fn>).mockResolvedValue(CREATED_USER);
    (prisma.token.create as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 1 });

    const res = await request.post("/api/users/signup").send(VALID_PAYLOAD);

    expect(res.status).toBe(201);
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.headers["set-cookie"][0]).toMatch(/refresh_token=/);
    expect(res.headers["set-cookie"][0]).toMatch(/HttpOnly/i);
    expect(res.body.data).toHaveProperty("username", "testuser");
    expect(res.body.data).toHaveProperty("email", "test@example.com");
    // Le hash du mot de passe ne doit jamais transiter vers le client
    expect(res.body.data).not.toHaveProperty("password_hash");
    expect(res.body.data).not.toHaveProperty("passwordHash");
  });

  // Vérifie qu'une inscription avec un email déjà utilisé est refusée
  it("should return 409 when email is already taken", async () => {
    (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "uuid-existing",
      email: "test@example.com",
    });

    const res = await request.post("/api/users/signup").send(VALID_PAYLOAD);

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("message", "Utilisateur déjà existant");
  });

  // Vérifie que Zod bloque un mot de passe trop court (moins de 12 caractères)
  it("should return 422 when password is shorter than 12 characters", async () => {
    const res = await request.post("/api/users/signup").send({
      ...VALID_PAYLOAD,
      password: "Short1!",
    });

    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty("message", "Données invalides");
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "password" }),
      ])
    );
  });

  // Vérifie que Zod bloque un email malformé
  it("should return 422 when email format is invalid", async () => {
    const res = await request.post("/api/users/signup").send({
      ...VALID_PAYLOAD,
      email: "pas-un-email",
    });

    expect(res.status).toBe(422);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "email" }),
      ])
    );
  });

  // Vérifie que les champs obligatoires manquants sont refusés
  it("should return 422 when required fields are missing", async () => {
    const res = await request.post("/api/users/signup").send({
      email: "test@example.com",
    });

    expect(res.status).toBe(422);
  });

  // Vérifie que la 11e tentative depuis la même IP est bloquée par le rate limiter
  it("should return 429 after more than 10 requests within a minute", async () => {
    // vi.resetModules() vide le registre de modules → le prochain import() recharge
    // tout depuis zéro, y compris le authLimiter avec un MemoryStore vierge (count = 0)
    vi.resetModules();

    vi.doMock("../../libs/prisma", () => ({
      default: {
        user: {
          findUnique: vi.fn().mockResolvedValue(null),
          create: vi.fn().mockResolvedValue(CREATED_USER),
        },
        token: { create: vi.fn().mockResolvedValue({ id: 1 }) },
      },
    }));

    vi.doMock("argon2", () => ({
      default: { hash: vi.fn().mockResolvedValue("$argon2id$mockedHash") },
    }));

    // Import dynamique → nouvelle instance de l'app avec un rate limiter vierge
    const { default: freshApp } = await import("../../../index");
    const freshRequest = supertest(freshApp);

    // Envoie 10 requêtes pour atteindre la limite autorisée
    for (let i = 0; i < 10; i++) {
      await freshRequest.post("/api/users/signup").send(VALID_PAYLOAD);
    }

    // La 11e doit être bloquée par le rate limiter
    const res = await freshRequest.post("/api/users/signup").send(VALID_PAYLOAD);

    expect(res.status).toBe(429);
    expect(res.body).toHaveProperty(
      "message",
      "Trop de tentatives, veuillez réessayer dans une minute."
    );
  });
});
