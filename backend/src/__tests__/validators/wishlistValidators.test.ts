/**
 * Tests unitaires — wishlistValidators.ts
 *
 * On teste ici addWishlistSchema, utilisé pour POST /wishlist.
 *
 * Points clés à couvrir :
 *  - bookId doit être un UUID valide (z.string().uuid())
 *  - status doit appartenir à l'enum ["À lire", "En cours", "Lu"]
 *  - status a une valeur par défaut "À lire" si absent
 */
import { addWishlistSchema } from "../../validators/wishlistValidators";
import { describe, it, expect } from "vitest";

// UUID valide réutilisé dans tous les tests de ce fichier
const validUuid = "550e8400-e29b-41d4-a716-446655440000";

describe("addWishlistSchema", () => {
  it("accepte des données valides avec un statut explicite", () => {
    expect(
      addWishlistSchema.safeParse({ bookId: validUuid, status: "Lu" }).success,
    ).toBe(true);
  });

  it("applique le statut par défaut 'À lire' si absent", () => {
    // Si l'utilisateur n'indique pas de statut, le livre est marqué "À lire"
    const result = addWishlistSchema.safeParse({ bookId: validUuid });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("À lire");
    }
  });

  it("accepte tous les statuts valides de l'enum", () => {
    // Vérifie que chaque valeur autorisée passe la validation
    for (const status of ["À lire", "En cours", "Lu"] as const) {
      expect(
        addWishlistSchema.safeParse({ bookId: validUuid, status }).success,
      ).toBe(true);
    }
  });

  it("rejette un bookId qui n'est pas un UUID", () => {
    // Un bookId non-UUID signifie que la référence au livre est invalide
    expect(
      addWishlistSchema.safeParse({ bookId: "pasuuid", status: "À lire" }).success,
    ).toBe(false);
  });

  it("rejette un statut hors de l'enum autorisé", () => {
    // "Terminé" n'est pas une valeur autorisée dans z.enum(["À lire", "En cours", "Lu"])
    expect(
      addWishlistSchema.safeParse({ bookId: validUuid, status: "Terminé" }).success,
    ).toBe(false);
  });
});
