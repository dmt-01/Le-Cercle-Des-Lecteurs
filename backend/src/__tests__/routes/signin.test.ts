/**
 * Tests d'intégration — POST /api/users/signin
 *
 * Approche : supertest + mock Prisma (vi.mock).
 * argon2.verify est mocké pour contrôler le résultat de la vérification du mot de passe.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import supertest from "supertest";
import app from "../../../index";
import prisma from "../../libs/prisma";

// ─── Mock Prisma ──────────────────────────────────────────────────────────────
vi.mock("../../libs/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
    token: {
      create: vi.fn(),
    },
  },
}));

// ─── Mock argon2 ──────────────────────────────────────────────────────────────
// argon2.verify est mocké pour simuler mot de passe valide ou invalide
vi.mock("argon2", () => ({
  default: {
    verify: vi.fn(),
  },
}));

// ─── Données de test ──────────────────────────────────────────────────────────

import argon2 from "argon2";

const request = supertest(app);

const VALID_PAYLOAD = {
  email: "test@example.com",
  password: "MonPassword1!",
};

// Utilisateur tel que Prisma le retournerait depuis la BDD
const FOUND_USER = {
  id: "uuid-abc-123",
  username: "testuser",
  email: "test@example.com",
  passwordHash: "$argon2id$v=19$storedHash",
  bio: null,
  profileImage: null,
  created_at: new Date("2026-01-01T00:00:00.000Z"),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("POST /api/users/signin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Vérifie qu'un utilisateur peut se connecter avec des identifiants valides
  it("should return 200, set httpOnly cookie, and return user without password_hash", async () => {
    (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(FOUND_USER);
    (argon2.verify as ReturnType<typeof vi.fn>).mockResolvedValue(true);
    (prisma.token.create as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 1 });

    const res = await request.post("/api/users/signin").send(VALID_PAYLOAD);

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.headers["set-cookie"][0]).toMatch(/refresh_token=/);
    expect(res.headers["set-cookie"][0]).toMatch(/HttpOnly/i);
    expect(res.body.data).toHaveProperty("username", "testuser");
    expect(res.body.data).toHaveProperty("email", "test@example.com");
    // Le hash du mot de passe ne doit jamais transiter vers le client
    expect(res.body.data).not.toHaveProperty("password_hash");
    expect(res.body.data).not.toHaveProperty("passwordHash");
  });

  // Vérifie qu'un email inexistant en base renvoie 401 (anti-énumération)
  it("should return 401 when email does not exist", async () => {
    (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const res = await request.post("/api/users/signin").send(VALID_PAYLOAD);

    expect(res.status).toBe(401);
    // Message identique au cas "mauvais mot de passe" — on ne révèle pas si l'email existe
    expect(res.body).toHaveProperty("message", "Email ou mot de passe incorrect");
  });

  // Vérifie qu'un mauvais mot de passe renvoie 401 avec le même message que l'email inexistant
  it("should return 401 when password is wrong", async () => {
    (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(FOUND_USER);
    (argon2.verify as ReturnType<typeof vi.fn>).mockResolvedValue(false);

    const res = await request.post("/api/users/signin").send(VALID_PAYLOAD);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Email ou mot de passe incorrect");
  });

  // Vérifie que les champs manquants sont refusés par Zod
  it("should return 422 when required fields are missing", async () => {
    const res = await request.post("/api/users/signin").send({
      email: "test@example.com",
      // password manquant
    });

    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty("message", "Données invalides");
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "password" }),
      ])
    );
  });

  // Vérifie que la 11e tentative depuis la même IP est bloquée par le rate limiter
  it("should return 429 after more than 10 requests within a minute", async () => {
    vi.resetModules();

    vi.doMock("../../libs/prisma", () => ({
      default: {
        user: { findUnique: vi.fn().mockResolvedValue(FOUND_USER) },
        token: { create: vi.fn().mockResolvedValue({ id: 1 }) },
      },
    }));

    vi.doMock("argon2", () => ({
      default: { verify: vi.fn().mockResolvedValue(true) },
    }));

    const { default: freshApp } = await import("../../../index");
    const freshRequest = supertest(freshApp);

    for (let i = 0; i < 10; i++) {
      await freshRequest.post("/api/users/signin").send(VALID_PAYLOAD);
    }

    const res = await freshRequest.post("/api/users/signin").send(VALID_PAYLOAD);

    expect(res.status).toBe(429);
    expect(res.body).toHaveProperty(
      "message",
      "Trop de tentatives, veuillez réessayer dans une minute."
    );
  });
});
