import { z } from "zod";

/**
 * Schéma Zod pour POST /groups (création d'un club).
 */
export const createGroupSchema = z.object({
  name:        z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  accessClub:  z.boolean().default(true),
});

/**
 * Schéma Zod pour POST /groups/:id/messages (envoi d'un message dans un club).
 */
export const sendGroupMessageSchema = z.object({
  content: z.string().min(1).max(2000),
});
