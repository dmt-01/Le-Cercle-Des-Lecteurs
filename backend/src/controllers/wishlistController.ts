import WishlistService from "../services/WishlistService";
import { Controller } from "../libs/Controller";
import { AppError } from "../libs/AppError";

const wishlistService = new WishlistService();

/** Contrôleur gérant les requêtes HTTP pour la wishlist et la bibliothèque personnelle. */
export default class WishlistController extends Controller {
  /** GET /wishlist — Retourne les livres de la wishlist de l'utilisateur connecté. Réponses : 200 | 500 */
  async list() {
    try {
      const userId = this.request.userId!;
      const data = await wishlistService.list(userId);
      return this.response.status(200).json({ data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }

  /** POST /wishlist — Ajoute ou met à jour un livre dans la wishlist. Réponses : 200 | 400 */
  async add() {
    try {
      const userId = this.request.userId!;
      const { bookId, status } = this.request.body as {
        bookId: string;
        status: string;
      };
      await wishlistService.add(userId, bookId, status);
      return this.response
        .status(200)
        .json({ message: "Livre ajouté à la wishlist" });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 400;
      return this.response.status(status).json({ message: error.message });
    }
  }

  /** DELETE /wishlist/:bookId — Retire un livre de la wishlist. Réponses : 200 | 404 | 500 */
  async remove() {
    try {
      const userId = this.request.userId!;
      const bookId = this.request.params.bookId as string;
      await wishlistService.remove(userId, bookId);
      return this.response
        .status(200)
        .json({ message: "Livre retiré de la wishlist" });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }
}
