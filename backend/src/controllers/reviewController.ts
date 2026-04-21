import ReviewRepository from "../repositories/reviewRepository";
import { Controller } from "../libs/Controller";
import Review from "../modeles/Review";

const reviewRepository = new ReviewRepository();

/**
 * Contrôleur gérant les reviews des livres.
 * Hérite de Controller qui expose this.request et this.response.
 */
export default class ReviewController extends Controller {

  /**
   * Liste des reviews d'un livre
   *
   * • Retourne toutes les reviews avec le username de l'auteur
   *
   * Réponses : 200
   */
  async list() {
    try {
      // 0.0 REQUEST : Récupérer l'UUID du livre depuis les paramètres de route
      const bookId = this.request.params.bookId as string;

      // 1.0 REVIEWS : Charger les reviews du livre depuis la base
      const rows = await reviewRepository.findByBook(bookId);

      // 2.0 RESPONSE : Sérialiser et retourner les reviews avec le username
      const data = rows.map((row) => ({
        ...Review.fromRow(row).serialize(),
        username: row.user.username,
      }));

      return this.response.status(200).json({ data });
    } catch (error: any) {
      return this.response.status(500).json({ message: error.message });
    }
  }

  /**
   * Création ou mise à jour de la review de l'utilisateur connecté
   *
   * • Un utilisateur ne peut avoir qu'une seule review par livre (upsert)
   * • Corps validé par Zod : content? et/ou note? (au moins un requis)
   * • Protégé par requireAuth
   *
   * Réponses : 400 | 200
   */
  async upsert() {
    try {
      // 0.0 REQUEST : Récupérer l'UUID du livre et les données du corps
      const bookId = this.request.params.bookId as string;
      const userId = this.request.userId!;
      const { content, note } = this.request.body as { content?: string; note?: number };

      // 1.0 REVIEW : Créer ou mettre à jour la review en base
      const row = await reviewRepository.upsert(bookId, userId, content, note);

      // 2.0 RESPONSE : Sérialiser et retourner la review
      return this.response.status(200).json({
        message: "Review enregistrée",
        data: Review.fromRow(row).serialize(),
      });
    } catch (error: any) {
      return this.response.status(400).json({ message: error.message });
    }
  }

  /**
   * Suppression de la review de l'utilisateur connecté
   *
   * • Un utilisateur ne peut supprimer que sa propre review
   * • Protégé par requireAuth
   *
   * Réponses : 404 | 200
   */
  async remove() {
    try {
      // 0.0 REQUEST : Récupérer l'UUID du livre et l'userId injecté par requireAuth
      const bookId = this.request.params.bookId as string;
      const userId = this.request.userId!;

      // 1.0 REVIEW : Supprimer la review en base
      const deleted = await reviewRepository.delete(bookId, userId);

      if (!deleted) {
        return this.response.status(404).json({ message: "Review introuvable" });
      }

      // 2.0 RESPONSE : Confirmer la suppression
      return this.response.status(200).json({ message: "Review supprimée" });
    } catch (error: any) {
      return this.response.status(500).json({ message: error.message });
    }
  }
}
