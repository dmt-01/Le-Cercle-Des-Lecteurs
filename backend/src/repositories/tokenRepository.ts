import Token from "../modeles/Token";
import prisma from "../libs/prisma";

/**
 * Repository gérant la persistance des tokens en base de données.
 */
export default class TokenRepository {
  /**
   * Enregistre un nouveau token en base.
   * @param token - Instance Token à persister
   * @returns L'identifiant du token créé
   */
  async create(token: Token): Promise<number> {
    const result = await prisma.token.create({
      data: {
        userId: token.getUserId(),
        tokenHash: token.getTokenHash(), // Hash SHA-256 du JWT (on ne stocke jamais le JWT brut)
        expiresAt: new Date(token.getExpiresAt()),
      },
    });
    return result.id;
  }

  /**
   * Recherche un token en base via son hash SHA-256.
   * Utilisé par requireAuth pour valider le cookie reçu.
   * @param hash - Hash SHA-256 du JWT brut
   * @returns Le token trouvé ou null
   */
  async findByHash(hash: string) {
    return await prisma.token.findFirst({
      where: { tokenHash: hash },
    });
  }

  /**
   * Remplace le token existant d'un utilisateur par un nouveau.
   * Opération atomique (transaction) : supprime l'ancien et insère le nouveau.
   * Utilisée lors du refresh pour la rotation des tokens.
   * @param token - Nouveau token à insérer
   * @returns L'identifiant du nouveau token créé
   */
  async replaceForUser(token: Token): Promise<number> {
    const result = await prisma.$transaction(async (transaction) => {
      // Supprimer l'ancien token de cet utilisateur
      await transaction.token.deleteMany({
        where: { userId: token.getUserId() },
      });
      // Insérer le nouveau token
      return await transaction.token.create({
        data: {
          userId: token.getUserId(),
          tokenHash: token.getTokenHash(),
          expiresAt: new Date(token.getExpiresAt()),
        },
      });
    });
    return result.id;
  }

  /**
   * Supprime tous les tokens d'un utilisateur.
   * Utilisé lors de la déconnexion.
   * @param userId - UUID de l'utilisateur
   */
  async deleteByUserId(userId: string): Promise<void> {
    await prisma.token.deleteMany({
      where: { userId },
    });
  }
}
