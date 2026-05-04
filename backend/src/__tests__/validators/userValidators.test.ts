/**
 * Tests unitaires — userValidators.ts
 *
 * On teste ici les 3 schémas Zod liés aux utilisateurs :
 *  - signupSchema   : validation de l'inscription (email, password fort, username)
 *  - signinSchema   : validation de la connexion
 *  - updateUserSchema : validation de la mise à jour de profil (champs optionnels)
 *
 * Ces tests n'ont besoin d'aucune base de données.
 * On appelle schema.safeParse(data) et on vérifie result.success.
 */
import { signupSchema, signinSchema, updateUserSchema } from "../../validators/userValidators";
import { describe, it, expect } from "vitest";

describe("signupSchema", () => {
  // Jeu de données valide réutilisé dans tous les tests de ce bloc.
  // "MonPassword1!" fait 13 chars et contient majuscule + minuscule + symbole.
  const valid = {
    username: "testuser",
    email: "test@example.com",
    password: "MonPassword1!",
  };

  it("accepte des données valides", () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it("accepte les champs optionnels bio et profile_image absents", () => {
    // bio et profile_image ne sont pas requis à l'inscription
    const result = signupSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejette un email malformé", () => {
    // Zod z.email() valide le format RFC — "pasunemail" ne contient pas de @
    expect(
      signupSchema.safeParse({ ...valid, email: "pasunemail" }).success,
    ).toBe(false);
  });

  it("rejette un password trop court (< 12 chars)", () => {
    // "Abcdef1!" = 8 chars, en dessous du minimum de 12
    expect(
      signupSchema.safeParse({ ...valid, password: "Abcdef1!" }).success,
    ).toBe(false);
  });

  it("rejette un password sans majuscule", () => {
    // La regex /[A-Z]/ doit trouver au moins une majuscule
    expect(
      signupSchema.safeParse({ ...valid, password: "abcdef123456!" }).success,
    ).toBe(false);
  });

  it("rejette un password sans minuscule", () => {
    // La regex /[a-z]/ doit trouver au moins une minuscule
    expect(
      signupSchema.safeParse({ ...valid, password: "ABCDEF123456!" }).success,
    ).toBe(false);
  });

  it("rejette un password sans symbole", () => {
    // La regex /[^A-Za-z0-9]/ doit trouver au moins un caractère spécial
    expect(
      signupSchema.safeParse({ ...valid, password: "Abcdef123456" }).success,
    ).toBe(false);
  });

  it("rejette un username trop court (< 3 chars)", () => {
    expect(
      signupSchema.safeParse({ ...valid, username: "ab" }).success,
    ).toBe(false);
  });

  it("rejette un username trop long (> 50 chars)", () => {
    // "a".repeat(51) génère une chaîne de 51 caractères
    expect(
      signupSchema.safeParse({ ...valid, username: "a".repeat(51) }).success,
    ).toBe(false);
  });
});

describe("signinSchema", () => {
  it("accepte des données valides", () => {
    // La connexion ne valide pas la force du password — juste qu'il est non vide
    expect(
      signinSchema.safeParse({ email: "test@example.com", password: "n'importe" }).success,
    ).toBe(true);
  });

  it("rejette un email malformé", () => {
    expect(
      signinSchema.safeParse({ email: "pasunemail", password: "secret" }).success,
    ).toBe(false);
  });

  it("rejette un password vide", () => {
    // z.string().min(1) interdit la chaîne vide
    expect(
      signinSchema.safeParse({ email: "test@example.com", password: "" }).success,
    ).toBe(false);
  });
});

describe("updateUserSchema", () => {
  it("accepte un objet vide (tous les champs sont optionnels)", () => {
    // Mise à jour partielle : on peut n'envoyer que les champs à modifier
    expect(updateUserSchema.safeParse({}).success).toBe(true);
  });

  it("accepte une mise à jour partielle (juste bio)", () => {
    expect(updateUserSchema.safeParse({ bio: "Passionné de lecture" }).success).toBe(true);
  });

  it("rejette un username trop court (< 3 chars)", () => {
    expect(updateUserSchema.safeParse({ username: "ab" }).success).toBe(false);
  });

  it("rejette une bio trop longue (> 500 chars)", () => {
    expect(updateUserSchema.safeParse({ bio: "a".repeat(501) }).success).toBe(false);
  });

  it("rejette une profileImage qui n'est pas une URL", () => {
    // z.url() attend une URL complète (https://...)
    expect(updateUserSchema.safeParse({ profileImage: "pasuneurl" }).success).toBe(false);
  });
});
