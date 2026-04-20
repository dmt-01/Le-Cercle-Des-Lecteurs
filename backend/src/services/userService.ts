import UserRepository from "../repositories/userRepository";
import { Request } from "express";

/**
 * Instance unique du repository utilisateur utilisée par les méthodes statiques.
 * Instanciée au niveau du module pour éviter de la recréer à chaque appel.
 */
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
}
