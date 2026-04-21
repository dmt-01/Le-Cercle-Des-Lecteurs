import UserRepository from "../repositories/userRepository";
import { AppError } from "../libs/AppError";
import { Request } from "express";
import User from "../modeles/User";

const userRepository = new UserRepository();

/**
 * Service gérant la logique métier liée aux utilisateurs.
 *
 * Contient :
 *  - Un constructeur pour instancier un objet User en mémoire
 *  - Des méthodes statiques pour les opérations côté base de données
 */
export default class UserService {

  protected username: string;
  protected email: string;
  protected password_hash: string;
  protected bio?: string;
  protected profile_image?: string;
  protected created_at: string;

  /**
   * Crée une instance de UserService (représentation en mémoire d'un utilisateur).
   * @param username      - Pseudo de l'utilisateur
   * @param email         - Adresse email
   * @param password_hash - Hash argon2 du mot de passe
   * @param bio           - Biographie (optionnelle)
   * @param profile_image - URL de l'image de profil (optionnelle)
   * @param created_at    - Date de création ISO (générée automatiquement si absente)
   */
  constructor(
    username: string,
    email: string,
    password_hash: string,
    bio?: string,
    profile_image?: string,
    created_at?: string,
  ) {
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
    this.bio = bio;
    this.profile_image = profile_image;
    this.created_at = created_at ?? new Date().toISOString();
  }

  /**
   * Crée un nouvel utilisateur en base de données via le repository.
   * @param data - Données de l'utilisateur à insérer
   * @returns L'utilisateur créé (retourné par Prisma)
   */
  static async CreateUser(data: {
    username: string;
    email: string;
    password_hash: string;
    bio?: string;
    profile_image?: string;
  }) {
    try {
      return await userRepository.create(data);
    } catch (error) {
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
  }

  /**
   * Valide qu'une requête d'authentification contient bien un email et un mot de passe.
   * @param request - Objet requête Express
   * @returns Un objet { success, data } ou { success, message } en cas d'échec
   */
  static async validateAuthRequest(request: Request) {
    const { email, password } = request.body ?? {};

    if (!request.body || !email || !password || typeof email !== "string" || typeof password !== "string") {
      return {
        success: false,
        message: "Email et mot de passe requis",
      };
    }

    return {
      success: true,
      data: { email, password },
    };
  }

  static async getMe(userId: string) {
    const found = await userRepository.findById(userId);
    if (!found) throw new AppError("Utilisateur introuvable", 404);

    return new User(
      found.id,
      found.username,
      found.email,
      found.passwordHash,
      found.bio ?? undefined,
      found.profileImage ?? undefined,
      found.created_at.toISOString(),
    ).serialize();
  }

  static async updateMe(userId: string, data: { username?: string; bio?: string; profileImage?: string }) {
    const updated = await userRepository.update(userId, data);
    if (!updated) throw new AppError("Utilisateur introuvable", 404);

    return new User(
      updated.id,
      updated.username,
      updated.email,
      updated.passwordHash,
      updated.bio ?? undefined,
      updated.profileImage ?? undefined,
      updated.created_at.toISOString(),
    ).serialize();
  }

  static async getPublicProfile(id: string) {
    const found = await userRepository.findByIdWithStats(id);
    if (!found) throw new AppError("Utilisateur introuvable", 404);

    return {
      id:            found.id,
      username:      found.username,
      bio:           found.bio ?? null,
      profile_image: found.profileImage ?? null,
      created_at:    found.created_at,
      followers:     found._count.followers,
      following:     found._count.following,
      reads:         found._count.reading,
      reviews:       found._count.reviews,
    };
  }

  static async follow(userId: string, userFollowedId: string) {
    if (userId === userFollowedId) {
      throw new AppError("Vous ne pouvez pas vous suivre vous-même", 400);
    }

    const done = await userRepository.follow(userId, userFollowedId);
    if (!done) throw new AppError("Vous suivez déjà cet utilisateur", 409);
  }

  static async unfollow(userId: string, userFollowedId: string) {
    const done = await userRepository.unfollow(userId, userFollowedId);
    if (!done) throw new AppError("Vous ne suivez pas cet utilisateur", 404);
  }
}
