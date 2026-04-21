import { z } from "zod";

/**
 * Schéma Zod pour POST /books/:id/reviews (création ou mise à jour).
 * Au moins un des deux champs doit être fourni.
 */
export const upsertReviewSchema = z
  .object({
    content: z.string().min(1).max(2000).optional(),
    note: z.number().int().min(1).max(5).optional(),
  })
  .refine((data) => data.content !== undefined || data.note !== undefined, {
    message: "Au moins un champ est requis : content ou note",
  });
