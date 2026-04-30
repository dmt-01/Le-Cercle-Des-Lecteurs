/**
 * Tests unitaires — messageValidators.ts
 *
 * On teste ici sendMessageSchema, utilisé pour POST /messages/:userId.
 *
 * La limite de 5000 chars (vs 2000 pour les messages de groupe) reflète
 * que les messages privés peuvent être plus longs.
 */
import { sendMessageSchema } from "../../validators/messageValidators";
import { describe, it, expect } from "vitest";

describe("sendMessageSchema", () => {
  it("accepte un message valide", () => {
    expect(sendMessageSchema.safeParse({ content: "Bonjour !" }).success).toBe(true);
  });

  it("rejette un message vide", () => {
    // Un message sans contenu n'a pas de sens
    expect(sendMessageSchema.safeParse({ content: "" }).success).toBe(false);
  });

  it("rejette un message trop long (> 5000 chars)", () => {
    expect(sendMessageSchema.safeParse({ content: "a".repeat(5001) }).success).toBe(false);
  });

  it("accepte un message de exactement 5000 chars (limite haute)", () => {
    // Vérifie que la limite est inclusive — 5000 est autorisé, 5001 ne l'est pas
    expect(sendMessageSchema.safeParse({ content: "a".repeat(5000) }).success).toBe(true);
  });
});
