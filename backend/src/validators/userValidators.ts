import { z } from "zod";

/**
 * Schéma Zod pour PUT /users/me (modification du profil).
 */
export const updateUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  bio: z.string().max(500).optional(),
  profileImage: z.url().optional(),
});

/**
 * Schéma Zod pour la route POST /signup.
 * Valide et type les données reçues dans le corps de la requête.
 */
export const signupSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.email(),
  password: z
    .string()
    .min(12, "Le mot de passe doit contenir au moins 12 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un symbole"),
  bio: z.string().optional(),
  profile_image: z.url().optional(),
});

/**
 * Schéma Zod pour la route POST /signin.
 */
export const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
