/**
 * Tests unitaires — eventValidators.ts
 *
 * On teste ici createEventSchema, utilisé pour POST /events.
 *
 * Points clés :
 *  - groupId doit être un UUID valide — lie l'événement à un club existant
 *  - link est optionnel mais doit être une URL si fourni
 *  - description est obligatoire (contrairement à d'autres entités)
 */
import { createEventSchema } from "../../validators/eventValidators";
import { describe, it, expect } from "vitest";

const validUuid = "550e8400-e29b-41d4-a716-446655440000";

describe("createEventSchema", () => {
  // Jeu de données valide de base réutilisé dans les tests
  const valid = {
    title: "Réunion mensuelle",
    description: "On discute du dernier livre",
    eventDate: "2026-05-15T19:00:00",
    groupId: validUuid,
  };

  it("accepte des données valides sans lien", () => {
    // link est optionnel — un événement n'a pas forcément de lien visio
    expect(createEventSchema.safeParse(valid).success).toBe(true);
  });

  it("accepte un lien optionnel valide", () => {
    expect(
      createEventSchema.safeParse({ ...valid, link: "https://meet.example.com/room" }).success,
    ).toBe(true);
  });

  it("rejette un titre vide", () => {
    expect(createEventSchema.safeParse({ ...valid, title: "" }).success).toBe(false);
  });

  it("rejette un titre trop long (> 255 chars)", () => {
    expect(
      createEventSchema.safeParse({ ...valid, title: "a".repeat(256) }).success,
    ).toBe(false);
  });

  it("rejette un groupId qui n'est pas un UUID", () => {
    // Un groupId invalide ne correspond à aucun club en base
    expect(
      createEventSchema.safeParse({ ...valid, groupId: "pasuuid" }).success,
    ).toBe(false);
  });

  it("rejette un lien qui n'est pas une URL", () => {
    // Si link est fourni, il doit être une URL complète (https://...)
    expect(
      createEventSchema.safeParse({ ...valid, link: "pasuneurl" }).success,
    ).toBe(false);
  });

  it("rejette si la description est absente", () => {
    // description est requise pour les événements (contrairement aux clubs)
    const { description, ...withoutDescription } = valid;
    expect(createEventSchema.safeParse(withoutDescription).success).toBe(false);
  });
});
