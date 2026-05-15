import BookService from "../services/BookService";
import { Controller } from "../libs/Controller";

const bookService = new BookService();

/** Contrôleur gérant les requêtes HTTP pour les livres. */
export default class BookController extends Controller {
  /** GET /books — Liste paginée avec filtres (genre, auteur, note). Réponses : 200 | 500 */
  async list() {
    try {
      const params = this.request.validatedQuery as {
        page?: number;
        limit?: number;
        genre?: string;
        tag?: string;
        author?: string;
      };
      const result = await bookService.list(params);
      return this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  /** GET /books/:id — Retourne le détail complet d'un livre. Réponses : 200 | 404 | 500 */
  async getById() {
    try {
      const id = this.request.params.id as string;
      const data = await bookService.getById(id);
      return this.response.status(200).json({ data });
    } catch (error) {
      this.next(error);
    }
  }

  /** POST /books — Crée un livre (authentifié). Réponses : 201 | 400 */
  async create() {
    try {
      const data = await bookService.create(this.request.body);
      return this.response.status(201).json({ message: "Livre créé", data });
    } catch (error) {
      this.next(error);
    }
  }

  /** PUT /books/:id — Met à jour un livre (authentifié). Réponses : 200 | 400 | 404 */
  async update() {
    try {
      const id = this.request.params.id as string;
      const data = await bookService.update(id, this.request.body);
      return this.response
        .status(200)
        .json({ message: "Livre mis à jour", data });
    } catch (error) {
      this.next(error);
    }
  }

  /** DELETE /books/:id — Supprime un livre (authentifié). Réponses : 200 | 404 | 500 */
  async remove() {
    try {
      const id = this.request.params.id as string;
      await bookService.remove(id);
      return this.response.status(200).json({ message: "Livre supprimé" });
    } catch (error) {
      this.next(error);
    }
  }

  /** GET /books/search?q= — Recherche par titre ou auteur. Réponses : 200 | 500 */
  async search() {
    try {
      const { q } = this.request.validatedQuery as { q: string };
      const data = await bookService.search(q);
      return this.response.status(200).json({ data });
    } catch (error) {
      this.next(error);
    }
  }

  /** POST /books/:id/read — Bascule l'état "lu" du livre pour l'utilisateur connecté. Réponses : 200 | 400 */
  async toggleRead() {
    try {
      const userId = this.request.userId!;
      const bookId = this.request.params.id as string;
      const result = await bookService.toggleRead(bookId, userId);
      return this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  /** POST /books/:id/like — Bascule le like du livre pour l'utilisateur connecté. Réponses : 200 | 400 */
  async toggleLike() {
    try {
      const userId = this.request.userId!;
      const bookId = this.request.params.id as string;
      const result = await bookService.toggleLike(bookId, userId);
      return this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}
