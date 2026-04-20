import BookRepository from "../repositories/bookRepository";
import { Controller } from "../libs/Controller";
import Book from "../modeles/Book";

const bookRepository = new BookRepository();

/**
 * Contrôleur gérant les opérations CRUD sur les livres.
 * Hérite de Controller qui expose this.request et this.response.
 */
export default class BookController extends Controller {

  /**
   * Liste paginée des livres avec filtres optionnels
   *
   * • Query params validés par Zod : page, limit, genre, tag, author
   * • Retourne les livres de la page demandée + métadonnées de pagination
   *
   * Réponses : 200
   */
  async list() {
    try {
      // 0.0 REQUEST : Récupérer les query params validés par le middleware
      const { page, limit, genre, tag, author } = this.request.query as {
        page?: number;
        limit?: number;
        genre?: string;
        tag?: string;
        author?: string;
      };

      // 1.0 BOOKS : Récupérer les livres depuis la base avec pagination et filtres
      const { books, total } = await bookRepository.findAll({ page, limit, genre, tag, author });

      // 2.0 RESPONSE : Sérialiser les livres et retourner les métadonnées de pagination
      const serialized = books.map((row) => Book.fromRow(row).serialize());

      return this.response.status(200).json({
        data: serialized,
        pagination: {
          page: page ?? 1,
          limit: limit ?? 20,
          total,
          totalPages: Math.ceil(total / (limit ?? 20)),
        },
      });
    } catch (error: any) {
      return this.response.status(500).json({ message: error.message });
    }
  }

  /**
   * Détail complet d'un livre
   *
   * • Charge le livre avec ses auteurs, genres, tags, reviews
   * • Calcule la note moyenne et le nombre de reviews
   *
   * Réponses : 404 | 200
   */
  async getById() {
    try {
      // 0.0 REQUEST : Récupérer l'UUID du livre dans les paramètres de route
      const { id } = this.request.params;

      // 1.0 BOOK : Charger le livre depuis la base avec toutes ses relations
      const row = await bookRepository.findById(id);

      if (!row) {
        return this.response.status(404).json({ message: "Livre introuvable" });
      }

      // 2.0 RESPONSE : Sérialiser et retourner le livre enrichi
      return this.response.status(200).json({ data: Book.fromRow(row).serialize() });
    } catch (error: any) {
      return this.response.status(500).json({ message: error.message });
    }
  }

  /**
   * Création d'un nouveau livre
   *
   * • Corps validé par Zod : title, coverImage?, description?, publicationDate?, authorIds?, genreIds?, tagIds?
   * • Protégé par requireAuth (+ vérification rôle admin côté route)
   *
   * Réponses : 400 | 201
   */
  async create() {
    try {
      // 0.0 REQUEST : Récupérer les données du corps validées par le middleware
      const data = this.request.body as {
        title: string;
        coverImage?: string;
        description?: string;
        publicationDate?: string;
        authorIds?: string[];
        genreIds?: string[];
        tagIds?: string[];
      };

      // 1.0 BOOK : Créer le livre en base avec ses relations
      const created = await bookRepository.create(data);

      // 2.0 RESPONSE : Sérialiser et retourner le livre créé
      return this.response.status(201).json({
        message: "Livre créé",
        data: Book.fromRow(created).serialize(),
      });
    } catch (error: any) {
      return this.response.status(400).json({ message: error.message });
    }
  }

  /**
   * Modification partielle d'un livre existant
   *
   * • Corps validé par Zod : title?, coverImage?, description?, publicationDate?
   * • Protégé par requireAuth (+ vérification rôle admin côté route)
   *
   * Réponses : 404 | 200
   */
  async update() {
    try {
      // 0.0 REQUEST : Récupérer l'UUID et les données à modifier
      const { id } = this.request.params;
      const data = this.request.body as {
        title?: string;
        coverImage?: string;
        description?: string;
        publicationDate?: string;
      };

      // 1.0 BOOK : Appliquer la mise à jour en base
      const updated = await bookRepository.update(id, data);

      if (!updated) {
        return this.response.status(404).json({ message: "Livre introuvable" });
      }

      // 2.0 RESPONSE : Sérialiser et retourner le livre mis à jour
      return this.response.status(200).json({
        message: "Livre mis à jour",
        data: Book.fromRow(updated).serialize(),
      });
    } catch (error: any) {
      return this.response.status(400).json({ message: error.message });
    }
  }

  /**
   * Suppression d'un livre
   *
   * • Protégé par requireAuth (+ vérification rôle admin côté route)
   *
   * Réponses : 404 | 200
   */
  async remove() {
    try {
      // 0.0 REQUEST : Récupérer l'UUID du livre à supprimer
      const { id } = this.request.params;

      // 1.0 BOOK : Supprimer le livre en base
      const deleted = await bookRepository.delete(id);

      if (!deleted) {
        return this.response.status(404).json({ message: "Livre introuvable" });
      }

      // 2.0 RESPONSE : Confirmer la suppression
      return this.response.status(200).json({ message: "Livre supprimé" });
    } catch (error: any) {
      return this.response.status(500).json({ message: error.message });
    }
  }

  /**
   * Recherche de livres par titre ou nom d'auteur
   *
   * • Query param validé par Zod : q (min 1 caractère)
   * • Recherche insensible à la casse, retourne au maximum 20 résultats
   *
   * Réponses : 200
   */
  async search() {
    try {
      // 0.0 REQUEST : Récupérer le terme de recherche validé par le middleware
      const { q } = this.request.query as { q: string };

      // 1.0 BOOKS : Rechercher les livres correspondants
      const rows = await bookRepository.search(q);

      // 2.0 RESPONSE : Sérialiser et retourner les résultats
      const serialized = rows.map((row) => Book.fromRow(row).serialize());

      return this.response.status(200).json({ data: serialized });
    } catch (error: any) {
      return this.response.status(500).json({ message: error.message });
    }
  }
}
