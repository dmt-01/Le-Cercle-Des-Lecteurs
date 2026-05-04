import { z } from "zod";

/**
 * Schéma Zod pour POST /messages/:userId (envoi d'un message privé).
 */
export const sendMessageSchema = z.object({
  content: z.string().min(1).max(5000),
});
