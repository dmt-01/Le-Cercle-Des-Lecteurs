/**
 * Tests unitaires — reviewValidators.ts
 *
 * On teste ici upsertReviewSchema, le schéma de POST /books/:id/reviews.
 *
 * Ce schéma est particulier : il utilise .refine() pour imposer une règle
 * personnalisée — au moins un des deux champs (content OU note) doit être présent.
 * z.refine() est une validation qui ne peut pas s'exprimer avec les règles Zod de base.
 */
import { upsertReviewSchema } from "../../validators/reviewValidators";
import { describe, it, expect } from "vitest";

describe("upsertReviewSchema", () => {
  it("accepte un content seul", () => {
    // Une review peut être textuelle sans note
    expect(upsertReviewSchema.safeParse({ content: "Excellent livre !" }).success).toBe(true);
  });

  it("accepte une note seule", () => {
    // Une review peut être juste une note sans commentaire
    expect(upsertReviewSchema.safeParse({ note: 4 }).success).toBe(true);
  });

  it("accepte content et note ensemble", () => {
    expect(upsertReviewSchema.safeParse({ content: "Top", note: 5 }).success).toBe(true);
  });

  it("rejette si ni content ni note ne sont fournis", () => {
    // Le .refine() custom renvoie le message "Au moins un champ est requis : content ou note"
    const result = upsertReviewSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Au moins un champ est requis : content ou note",
      );
    }
  });

  it("rejette une note de 0 (minimum est 1)", () => {
    // L'échelle de notation va de 1 à 5 — 0 est hors plage
    expect(upsertReviewSchema.safeParse({ note: 0 }).success).toBe(false);
  });

  it("rejette une note de 6 (maximum est 5)", () => {
    expect(upsertReviewSchema.safeParse({ note: 6 }).success).toBe(false);
  });

  it("rejette un content vide", () => {
    // Si content est fourni, il doit contenir au moins 1 caractère
    expect(upsertReviewSchema.safeParse({ content: "" }).success).toBe(false);
  });

  it("rejette un content trop long (> 2000 chars)", () => {
    expect(upsertReviewSchema.safeParse({ content: "a".repeat(2001) }).success).toBe(false);
  });

  it("rejette une note décimale (doit être un entier)", () => {
    // z.number().int() interdit les décimaux comme 3.5
    expect(upsertReviewSchema.safeParse({ note: 3.5 }).success).toBe(false);
  });
});
