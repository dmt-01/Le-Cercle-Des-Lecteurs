import { z } from "zod";

/**
 * Schéma Zod pour la route POST /signup.
 * Valide et type les données reçues dans le corps de la requête.
 */
export const signupSchema = z.object({
  username: z.string().min(3).max(50),          // Entre 3 et 50 caractères
  email: z.string().email(),                     // Format email valide
  password: z.string().min(12),                  // Minimum 12 caractères
  bio: z.string().optional(),                    // Biographie (facultatif)
  profile_image: z.string().url().optional(),    // URL valide (facultatif)
});

/**
 * Schéma Zod pour la route POST /signin.
 * Valide et type les données reçues dans le corps de la requête.
 */
export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
