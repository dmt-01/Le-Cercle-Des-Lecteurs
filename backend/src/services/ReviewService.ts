import ReviewRepository from "../repositories/reviewRepository";
import { AppError } from "../libs/AppError";
import Review from "../modeles/Review";

const reviewRepository = new ReviewRepository();

export default class ReviewService {
  async list(bookId: string) {
    const rows = await reviewRepository.findByBook(bookId);
    return rows.map((row) => ({
      ...Review.fromRow(row).serialize(),
      username: row.user.username,
    }));
  }

  async upsert(
    bookId: string,
    userId: string,
    content?: string,
    note?: number,
  ) {
    const row = await reviewRepository.upsert(bookId, userId, content, note);
    return Review.fromRow(row).serialize();
  }

  async remove(bookId: string, userId: string) {
    const deleted = await reviewRepository.delete(bookId, userId);
    if (!deleted) throw new AppError("Review introuvable", 404);
  }
}
