import { z } from "zod";

/**
 * Schéma Zod pour les query params de GET /books.
 * Tous les paramètres sont optionnels.
 */
export const listBooksSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  genre: z.string().optional(),
  tag: z.string().optional(),
  author: z.string().optional(),
});

/**
 * Schéma Zod pour GET /books/search.
 */
export const searchBooksSchema = z.object({
  q: z.string().min(1),
});

/**
 * Schéma Zod pour POST /books (création).
 */
export const createBookSchema = z.object({
  title: z.string().min(1).max(255),
  coverImage: z.url().optional(),
  description: z.string().optional(),
  publicationDate: z.string().optional(),          // Format ISO : "2024-01-15"
  authorIds: z.array(z.string()).optional(),        // UUIDs des auteurs existants
  genreIds: z.array(z.string()).optional(),         // UUIDs des genres existants
  tagIds: z.array(z.string()).optional(),           // UUIDs des tags existants
});

/**
 * Schéma Zod pour PUT /books/:id (modification partielle).
 */
export const updateBookSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  coverImage: z.url().optional(),
  description: z.string().optional(),
  publicationDate: z.string().optional(),
});
