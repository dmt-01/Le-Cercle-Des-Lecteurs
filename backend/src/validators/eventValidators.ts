import { z } from "zod";

/**
 * Schéma Zod pour POST /events (création d'un événement).
 */
export const createEventSchema = z.object({
  title:       z.string().min(1).max(255),
  description: z.string().min(1),
  eventDate:   z.string().min(1),         // Format ISO : "2026-05-15T19:00:00"
  link:        z.url().optional(),
  groupId:     z.string().uuid(),
});
