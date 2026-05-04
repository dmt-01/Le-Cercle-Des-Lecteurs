import ReviewRepository from "../repositories/reviewRepository";
import { AppError } from "../libs/AppError";
import Review from "../modeles/Review";

const reviewRepository = new ReviewRepository();

/** Service gérant la logique métier liée aux avis (reviews) sur les livres. */
export default class ReviewService {
  /**
   * Retourne toutes les reviews d'un livre avec le username de l'auteur.
   * @param bookId - UUID du livre
   */
  async list(bookId: string) {
    const rows = await reviewRepository.findByBook(bookId);
    return rows.map((row) => ({
      ...Review.fromRow(row).serialize(),
      username: row.user.username,
    }));
  }

  /**
   * Crée ou met à jour la review d'un utilisateur pour un livre (upsert).
   * @param bookId  - UUID du livre
   * @param userId  - UUID de l'auteur de la review
   * @param content - Texte de la review (optionnel)
   * @param note    - Note de 1 à 5 (optionnel)
   */
  async upsert(
    bookId: string,
    userId: string,
    content?: string,
    note?: number,
  ) {
    const row = await reviewRepository.upsert(bookId, userId, content, note);
    return Review.fromRow(row).serialize();
  }

  /**
   * Supprime la review d'un utilisateur pour un livre.
   * @param bookId - UUID du livre
   * @param userId - UUID de l'auteur de la review
   */
  async remove(bookId: string, userId: string) {
    const deleted = await reviewRepository.delete(bookId, userId);
    if (!deleted) throw new AppError("Review introuvable", 404);
  }
}
