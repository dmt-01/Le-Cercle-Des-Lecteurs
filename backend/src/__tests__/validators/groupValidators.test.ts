/**
 * Tests unitaires — groupValidators.ts
 *
 * On teste ici les 2 schémas Zod liés aux clubs de lecture :
 *  - createGroupSchema       : corps de POST /groups
 *  - sendGroupMessageSchema  : corps de POST /groups/:id/messages
 */
import { createGroupSchema, sendGroupMessageSchema } from "../../validators/groupValidators";
import { describe, it, expect } from "vitest";

describe("createGroupSchema", () => {
  it("accepte des données valides", () => {
    expect(createGroupSchema.safeParse({ name: "Les amis du livre" }).success).toBe(true);
  });

  it("applique accessClub à true par défaut", () => {
    // Si accessClub n'est pas fourni, le club est public par défaut
    const result = createGroupSchema.safeParse({ name: "Mon club" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.accessClub).toBe(true);
    }
  });

  it("accepte accessClub à false (club privé)", () => {
    const result = createGroupSchema.safeParse({ name: "Club privé", accessClub: false });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.accessClub).toBe(false);
    }
  });

  it("rejette un nom vide", () => {
    // Un club sans nom n'est pas valide
    expect(createGroupSchema.safeParse({ name: "" }).success).toBe(false);
  });

  it("rejette un nom trop long (> 100 chars)", () => {
    expect(createGroupSchema.safeParse({ name: "a".repeat(101) }).success).toBe(false);
  });

  it("rejette une description trop longue (> 500 chars)", () => {
    expect(
      createGroupSchema.safeParse({ name: "Mon club", description: "a".repeat(501) }).success,
    ).toBe(false);
  });
});

describe("sendGroupMessageSchema", () => {
  it("accepte un message valide", () => {
    expect(sendGroupMessageSchema.safeParse({ content: "Bonjour à tous !" }).success).toBe(true);
  });

  it("rejette un message vide", () => {
    expect(sendGroupMessageSchema.safeParse({ content: "" }).success).toBe(false);
  });

  it("rejette un message trop long (> 2000 chars)", () => {
    // Limite pour éviter les messages excessivement longs dans un club
    expect(
      sendGroupMessageSchema.safeParse({ content: "a".repeat(2001) }).success,
    ).toBe(false);
  });
});
