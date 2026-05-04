import ReviewService from "../services/ReviewService";
import { Controller } from "../libs/Controller";
import { AppError } from "../libs/AppError";

const reviewService = new ReviewService();

/** Contrôleur gérant les requêtes HTTP pour les avis (reviews) sur les livres. */
export default class ReviewController extends Controller {
  /** GET /books/:bookId/reviews — Retourne les reviews d'un livre. Réponses : 200 | 500 */
  async list() {
    try {
      const bookId = this.request.params.bookId as string;
      const data = await reviewService.list(bookId);
      return this.response.status(200).json({ data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }

  /** POST /books/:bookId/reviews — Crée ou met à jour la review de l'utilisateur. Réponses : 200 | 400 */
  async upsert() {
    try {
      const bookId = this.request.params.bookId as string;
      const userId = this.request.userId!;
      const { content, note } = this.request.body as {
        content?: string;
        note?: number;
      };
      const data = await reviewService.upsert(bookId, userId, content, note);
      return this.response
        .status(200)
        .json({ message: "Review enregistrée", data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 400;
      return this.response.status(status).json({ message: error.message });
    }
  }

  /** DELETE /books/:bookId/reviews — Supprime la review de l'utilisateur. Réponses : 200 | 404 | 500 */
  async remove() {
    try {
      const bookId = this.request.params.bookId as string;
      const userId = this.request.userId!;
      await reviewService.remove(bookId, userId);
      return this.response.status(200).json({ message: "Review supprimée" });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }
}
