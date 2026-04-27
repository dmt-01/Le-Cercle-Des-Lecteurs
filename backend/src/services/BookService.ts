import BookRepository from "../repositories/bookRepository";
import { AppError } from "../libs/AppError";
import Book from "../modeles/Book";

const bookRepository = new BookRepository();

export default class BookService {
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

  async getById(id: string) {
    const row = await bookRepository.findById(id);
    if (!row) throw new AppError("Livre introuvable", 404);
    return Book.fromRow(row).serialize();
  }

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

  async remove(id: string) {
    const deleted = await bookRepository.delete(id);
    if (!deleted) throw new AppError("Livre introuvable", 404);
  }

  async search(q: string) {
    const rows = await bookRepository.search(q);
    return rows.map((row) => Book.fromRow(row).serialize());
  }

  async toggleRead(bookId: string, userId: string) {
    const isNowRead = await bookRepository.toggleRead(bookId, userId);
    return {
      message: isNowRead
        ? "Livre marqué comme lu"
        : "Livre retiré des lectures",
      read: isNowRead,
    };
  }

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
