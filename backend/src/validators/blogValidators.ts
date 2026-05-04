import { z } from "zod";

/**
 * Schéma Zod pour POST /blog (publication d'un article).
 */
export const createBlogSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  category: z.string().max(100).optional(),
});
