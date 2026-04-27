import prisma from "../libs/prisma";

/**
 * Repository gérant les accès en base de données pour les utilisateurs.
 */
export default class UserRepository {

  /**
   * Recherche un utilisateur par son email.
   * @param email - Email à rechercher
   * @returns L'utilisateur trouvé ou null
   */
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Recherche un utilisateur par son identifiant UUID.
   * Utilisé par requireAuth et les routes protégées pour charger l'utilisateur courant.
   * @param id - UUID de l'utilisateur
   * @returns L'utilisateur trouvé ou null
   */
  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Retourne le profil public d'un utilisateur avec ses compteurs.
   * @param id - UUID de l'utilisateur
   */
  async findByIdWithStats(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id:           true,
        username:     true,
        bio:          true,
        profileImage: true,
        created_at:   true,
        _count: {
          select: {
            followers: true,
            following: true,
            reviews:   true,
            reading:   true,
          },
        },
        memberships: {
          select: {
            group: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  /**
   * Met à jour les informations de profil d'un utilisateur.
   * @param id   - UUID de l'utilisateur
   * @param data - Champs à modifier
   * @returns L'utilisateur mis à jour ou null si introuvable
   */
  async update(id: string, data: { username?: string; bio?: string; profileImage?: string }) {
    try {
      return await prisma.user.update({
        where: { id },
        data: {
          username:     data.username,
          bio:          data.bio,
          profileImage: data.profileImage,
        },
      });
    } catch {
      return null;
    }
  }

  /**
   * Crée une relation de follow entre deux utilisateurs.
   * @returns true si créé, false si déjà suivi
   */
  async follow(userId: string, userFollowedId: string): Promise<boolean> {
    try {
      await prisma.follow.create({ data: { userId, userFollowedId } });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Supprime la relation de follow entre deux utilisateurs.
   * @returns true si supprimé, false si introuvable
   */
  async unfollow(userId: string, userFollowedId: string): Promise<boolean> {
    const result = await prisma.follow.deleteMany({
      where: { userId, userFollowedId },
    });
    return result.count > 0;
  }

  /**
   * Crée un nouvel utilisateur en base.
   * Les noms de champs sont convertis de snake_case (interne) vers camelCase (Prisma).
   * @param data - Données de l'utilisateur à insérer
   * @returns L'utilisateur créé avec son identifiant généré
   */
  async create(data: {
    username: string;
    email: string;
    password_hash: string;
    bio?: string;
    profile_image?: string;
  }) {
    try {
      return await prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          passwordHash: data.password_hash,      // Prisma attend camelCase (mappé vers password_hash en BDD)
          bio: data.bio,
          profileImage: data.profile_image,      // Prisma attend camelCase (mappé vers profile_image en BDD)
        },
      });
    } catch (error) {
      throw new Error("utilisateur non créé");
    }
  }
}
