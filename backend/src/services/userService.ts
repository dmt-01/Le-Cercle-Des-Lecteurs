import UserRepository from "../repositories/userRepository";
import { AppError } from "../libs/AppError";
import User from "../modeles/User";

const userRepository = new UserRepository();

/**
 * Service gérant la logique métier liée aux utilisateurs.
 * Toutes les méthodes sont statiques — cette classe n'est jamais instanciée.
 */
export default class UserService {
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
   * Retourne le profil complet de l'utilisateur connecté.
   * @param userId - UUID de l'utilisateur
   */
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

  /**
   * Met à jour les informations du profil de l'utilisateur connecté.
   * @param userId - UUID de l'utilisateur
   * @param data   - Champs à modifier (partiels)
   */
  static async updateMe(
    userId: string,
    data: { username?: string; bio?: string; profileImage?: string },
  ) {
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

  static async getPublicProfile(id: string, viewerId?: string) {
    const found = await userRepository.findByIdWithStats(id);
    if (!found) throw new AppError("Utilisateur introuvable", 404);

    // Vérifie si l'appelant connecté suit déjà cet utilisateur
    const is_following =
      viewerId && viewerId !== id
        ? await userRepository.isFollowing(viewerId, id)
        : false;

    return {
      id: found.id,
      username: found.username,
      bio: found.bio ?? null,
      profile_image: found.profileImage ?? null,
      created_at: found.created_at,
      followers: found._count.followers,
      following: found._count.following,
      reads: found._count.reading,
      reviews: found._count.reviews,
      groups: found.memberships.map((m) => m.group),
      is_following,
    };
  }

  /**
   * Abonne un utilisateur à un autre. Interdit de se suivre soi-même.
   * @param userId         - UUID de l'utilisateur qui s'abonne
   * @param userFollowedId - UUID de l'utilisateur suivi
   */
  static async follow(userId: string, userFollowedId: string) {
    if (userId === userFollowedId) {
      throw new AppError("Vous ne pouvez pas vous suivre vous-même", 400);
    }

    const done = await userRepository.follow(userId, userFollowedId);
    if (!done) throw new AppError("Vous suivez déjà cet utilisateur", 409);
  }

  /**
   * Désabonne un utilisateur d'un autre.
   * @param userId         - UUID de l'utilisateur qui se désabonne
   * @param userFollowedId - UUID de l'utilisateur à ne plus suivre
   */
  static async unfollow(userId: string, userFollowedId: string) {
    const done = await userRepository.unfollow(userId, userFollowedId);
    if (!done) throw new AppError("Vous ne suivez pas cet utilisateur", 404);
  }
}
