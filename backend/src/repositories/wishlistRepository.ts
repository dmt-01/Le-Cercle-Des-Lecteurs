import { bookIncludes } from "./bookRepository";
import prisma from "../libs/prisma";

/**
 * Repository gérant les accès en base de données pour les wishlists.
 */
export default class WishlistRepository {
  /**
   * Retourne tous les livres de la wishlist d'un utilisateur.
   * @param userId - UUID de l'utilisateur
   */
  async findByUser(userId: string) {
    return await prisma.wishlist.findMany({
      where: { userId },
      include: { book: { include: bookIncludes } },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Ajoute un livre à la wishlist ou met à jour son statut si déjà présent.
   * @param userId  - UUID de l'utilisateur
   * @param bookId  - UUID du livre
   * @param status  - Statut de lecture ("À lire", "En cours", "Lu")
   */
  async upsert(userId: string, bookId: string, status: string) {
    return await prisma.wishlist.upsert({
      where: { bookId_userId: { bookId, userId } },
      create: { userId, bookId, status },
      update: { status },
    });
  }

  /**
   * Retire un livre de la wishlist.
   * @param userId - UUID de l'utilisateur
   * @param bookId - UUID du livre
   * @returns true si supprimé, false si introuvable
   */
  async remove(userId: string, bookId: string): Promise<boolean> {
    try {
      await prisma.wishlist.delete({
        where: { bookId_userId: { bookId, userId } },
      });
      return true;
    } catch {
      return false;
    }
  }
}
