import BookRepository from "../repositories/bookRepository";
import { AppError } from "../libs/AppError";
import Book from "../modeles/Book";

const bookRepository = new BookRepository();

/** Service gérant la logique métier liée aux livres. */
export default class BookService {
  /**
   * Retourne la liste paginée des livres avec filtres optionnels.
   * @param params - Filtres et pagination (page, limit, genre, tag, author)
   */
  async list(params: {
    page?: number;
    limit?: number;
    genre?: string;
    tag?: string;
    author?: string;
  }) {
    const { books, total } = await bookRepository.findAll(params);
    const limit = params.limit ?? 20;
    return {
      data: books.map((row) => Book.fromRow(row).serialize()),
      pagination: {
        page: params.page ?? 1,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Retourne le détail complet d'un livre (auteurs, genres, tags, note moyenne).
   * @param id - UUID du livre
   */
  async getById(id: string) {
    const row = await bookRepository.findById(id);
    if (!row) throw new AppError("Livre introuvable", 404);
    return Book.fromRow(row).serialize();
  }

  /**
   * Crée un nouveau livre avec ses relations (auteurs, genres, tags).
   * @param data - Données du livre à créer
   */
  async create(data: {
    title: string;
    coverImage?: string;
    description?: string;
    publicationDate?: string;
    authorIds?: string[];
    genreIds?: string[];
    tagIds?: string[];
  }) {
    const created = await bookRepository.create(data);
    return Book.fromRow(created).serialize();
  }

  /**
   * Met à jour les champs d'un livre existant.
   * @param id   - UUID du livre
   * @param data - Champs à modifier (partiels)
   */
  async update(
    id: string,
    data: {
      title?: string;
      coverImage?: string;
      description?: string;
      publicationDate?: string;
    },
  ) {
    const updated = await bookRepository.update(id, data);
    if (!updated) throw new AppError("Livre introuvable", 404);
    return Book.fromRow(updated).serialize();
  }

  /**
   * Supprime un livre. Lance une AppError 404 si introuvable.
   * @param id - UUID du livre
   */
  async remove(id: string) {
    const deleted = await bookRepository.delete(id);
    if (!deleted) throw new AppError("Livre introuvable", 404);
  }

  /**
   * Recherche des livres par titre ou nom d'auteur (insensible à la casse).
   * @param q - Texte recherché
   */
  async search(q: string) {
    const rows = await bookRepository.search(q);
    return rows.map((row) => Book.fromRow(row).serialize());
  }

  /**
   * Bascule l'état "lu" d'un livre pour un utilisateur.
   * @param bookId - UUID du livre
   * @param userId - UUID de l'utilisateur
   */
  async toggleRead(bookId: string, userId: string) {
    const isNowRead = await bookRepository.toggleRead(bookId, userId);
    return {
      message: isNowRead
        ? "Livre marqué comme lu"
        : "Livre retiré des lectures",
      read: isNowRead,
    };
  }

  /**
   * Bascule l'état "favori" d'un livre pour un utilisateur.
   * @param bookId - UUID du livre
   * @param userId - UUID de l'utilisateur
   */
  async toggleLike(bookId: string, userId: string) {
    const isNowLiked = await bookRepository.toggleLike(bookId, userId);
    return {
      message: isNowLiked
        ? "Livre ajouté aux favoris"
        : "Livre retiré des favoris",
      liked: isNowLiked,
    };
  }
}
