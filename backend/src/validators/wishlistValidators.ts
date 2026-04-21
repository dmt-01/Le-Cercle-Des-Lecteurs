import { z } from "zod";

/**
 * Schéma Zod pour POST /wishlist (ajout ou mise à jour).
 */
export const addWishlistSchema = z.object({
  bookId: z.string().uuid(),
  status: z.enum(["À lire", "En cours", "Lu"]).default("À lire"),
});
