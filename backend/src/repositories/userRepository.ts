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
