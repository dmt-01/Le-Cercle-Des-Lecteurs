/**
 * Tests unitaires — bookValidators.ts
 *
 * On teste ici les 4 schémas Zod liés aux livres :
 *  - listBooksSchema   : query params de GET /books (pagination + filtres)
 *  - searchBooksSchema : query param q de GET /books/search
 *  - createBookSchema  : corps de POST /books
 *  - updateBookSchema  : corps de PUT /books/:id
 *
 * Point clé : listBooksSchema utilise z.coerce.number() car les query params
 * sont toujours des strings dans Express — Zod les convertit en nombres.
 */
import { listBooksSchema, searchBooksSchema, createBookSchema, updateBookSchema } from "../../validators/bookValidators";
import { describe, it, expect } from "vitest";

describe("listBooksSchema", () => {
  it("applique les valeurs par défaut si aucun paramètre", () => {
    // Sans paramètres, page=1 et limit=20 sont les valeurs par défaut
    const result = listBooksSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
    }
  });

  it("coerce les strings en nombres (comportement des query params)", () => {
    // Express reçoit toujours des strings depuis l'URL : ?page=3&limit=50
    // z.coerce.number() convertit "3" → 3 et "50" → 50
    const result = listBooksSchema.safeParse({ page: "3", limit: "50" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(50);
    }
  });

  it("rejette page = 0 (minimum est 1)", () => {
    // Une page 0 n'a pas de sens — le schéma impose .min(1)
    expect(listBooksSchema.safeParse({ page: "0" }).success).toBe(false);
  });

  it("rejette limit > 100", () => {
    // Protection contre les requêtes abusives qui demanderaient trop de résultats
    expect(listBooksSchema.safeParse({ limit: "101" }).success).toBe(false);
  });
});

describe("searchBooksSchema", () => {
  it("accepte une recherche non vide", () => {
    expect(searchBooksSchema.safeParse({ q: "harry potter" }).success).toBe(true);
  });

  it("rejette une chaîne vide", () => {
    // z.string().min(1) : une recherche vide ne servirait à rien
    expect(searchBooksSchema.safeParse({ q: "" }).success).toBe(false);
  });

  it("rejette si q est absent", () => {
    // Le paramètre q est obligatoire pour cette route
    expect(searchBooksSchema.safeParse({}).success).toBe(false);
  });
});

describe("createBookSchema", () => {
  it("accepte un titre seul (champs minimaux)", () => {
    // Seul le title est requis — tous les autres champs sont optionnels
    expect(createBookSchema.safeParse({ title: "Mon livre" }).success).toBe(true);
  });

  it("accepte tous les champs optionnels renseignés", () => {
    expect(
      createBookSchema.safeParse({
        title: "Mon livre",
        coverImage: "https://example.com/cover.jpg",
        description: "Un beau livre",
        publicationDate: "2024-01-15",
        authorIds: ["550e8400-e29b-41d4-a716-446655440000"],
        genreIds: [],
        tagIds: [],
      }).success,
    ).toBe(true);
  });

  it("rejette un titre vide", () => {
    // z.string().min(1) : un livre sans titre n'est pas valide
    expect(createBookSchema.safeParse({ title: "" }).success).toBe(false);
  });

  it("rejette un titre trop long (> 255 chars)", () => {
    expect(createBookSchema.safeParse({ title: "a".repeat(256) }).success).toBe(false);
  });

  it("rejette une coverImage qui n'est pas une URL", () => {
    expect(
      createBookSchema.safeParse({ title: "Mon livre", coverImage: "pasuneurl" }).success,
    ).toBe(false);
  });
});

describe("updateBookSchema", () => {
  it("accepte un objet vide (tous les champs sont optionnels)", () => {
    // Mise à jour partielle : on peut ne modifier qu'un seul champ à la fois
    expect(updateBookSchema.safeParse({}).success).toBe(true);
  });

  it("accepte une mise à jour partielle", () => {
    expect(updateBookSchema.safeParse({ title: "Nouveau titre" }).success).toBe(true);
  });

  it("rejette un titre vide", () => {
    // Si title est fourni, il doit avoir au moins 1 caractère
    expect(updateBookSchema.safeParse({ title: "" }).success).toBe(false);
  });
});
