import WishlistRepository from "../repositories/wishlistRepository";
import { AppError } from "../libs/AppError";
import Book from "../modeles/Book";

const wishlistRepository = new WishlistRepository();

export default class WishlistService {

  async list(userId: string) {
    const rows = await wishlistRepository.findByUser(userId);
    return rows.map((item) => ({
      status:   item.status,
      added_at: item.createdAt,
      book:     Book.fromRow(item.book).serialize(),
    }));
  }

  async add(userId: string, bookId: string, status: string) {
    await wishlistRepository.upsert(userId, bookId, status);
  }

  async remove(userId: string, bookId: string) {
    const deleted = await wishlistRepository.remove(userId, bookId);
    if (!deleted) throw new AppError("Livre introuvable dans la wishlist", 404);
  }
}
