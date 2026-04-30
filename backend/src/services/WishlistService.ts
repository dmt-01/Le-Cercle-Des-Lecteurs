import WishlistRepository from "../repositories/wishlistRepository";
import { AppError } from "../libs/AppError";
import Book from "../modeles/Book";

const wishlistRepository = new WishlistRepository();

/** Service gérant la logique métier liée à la wishlist et à la bibliothèque personnelle. */
export default class WishlistService {
  /**
   * Retourne tous les livres de la wishlist d'un utilisateur avec leur statut de lecture.
   * @param userId - UUID de l'utilisateur
   */
  async list(userId: string) {
    const rows = await wishlistRepository.findByUser(userId);
    return rows.map((item) => ({
      status: item.status,
      added_at: item.createdAt,
      book: Book.fromRow(item.book).serialize(),
    }));
  }

  /**
   * Ajoute un livre à la wishlist ou met à jour son statut si déjà présent (upsert).
   * @param userId - UUID de l'utilisateur
   * @param bookId - UUID du livre
   * @param status - Statut de lecture ("À lire", "En cours", "Lu")
   */
  async add(userId: string, bookId: string, status: string) {
    await wishlistRepository.upsert(userId, bookId, status);
  }

  /**
   * Retire un livre de la wishlist.
   * @param userId - UUID de l'utilisateur
   * @param bookId - UUID du livre à retirer
   */
  async remove(userId: string, bookId: string) {
    const deleted = await wishlistRepository.remove(userId, bookId);
    if (!deleted) throw new AppError("Livre introuvable dans la wishlist", 404);
  }
}
