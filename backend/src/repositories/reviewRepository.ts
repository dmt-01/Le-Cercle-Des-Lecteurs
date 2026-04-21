import prisma from "../libs/prisma";

/**
 * Repository gérant les accès en base de données pour les reviews.
 */
export default class ReviewRepository {

  /**
   * Retourne toutes les reviews d'un livre.
   * @param bookId - UUID du livre
   * @returns Liste des reviews avec le username de l'auteur
   */
  async findByBook(bookId: string) {
    return await prisma.review.findMany({
      where: { bookId },
      include: {
        user: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Retourne la review d'un utilisateur pour un livre donné.
   * @param bookId - UUID du livre
   * @param userId - UUID de l'utilisateur
   */
  async findOne(bookId: string, userId: string) {
    return await prisma.review.findUnique({
      where: { bookId_userId: { bookId, userId } },
    });
  }

  /**
   * Crée ou met à jour la review d'un utilisateur pour un livre.
   * Utilise un upsert car la clé est composite [bookId, userId].
   * @param bookId  - UUID du livre
   * @param userId  - UUID de l'utilisateur
   * @param content - Texte de la review (optionnel)
   * @param note    - Note de 1 à 5 (optionnel)
   */
  async upsert(bookId: string, userId: string, content?: string, note?: number) {
    return await prisma.review.upsert({
      where: { bookId_userId: { bookId, userId } },
      create: { bookId, userId, content, note },
      update: { content, note },
    });
  }

  /**
   * Supprime la review d'un utilisateur pour un livre.
   * @param bookId - UUID du livre
   * @param userId - UUID de l'utilisateur
   * @returns true si supprimée, false si introuvable
   */
  async delete(bookId: string, userId: string): Promise<boolean> {
    try {
      await prisma.review.delete({
        where: { bookId_userId: { bookId, userId } },
      });
      return true;
    } catch {
      return false;
    }
  }
}