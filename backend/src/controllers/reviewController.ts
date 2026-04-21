import { AppError } from "../libs/AppError";
import ReviewService from "../services/ReviewService";
import { Controller } from "../libs/Controller";

const reviewService = new ReviewService();

export default class ReviewController extends Controller {

  async list() {
    try {
      const bookId = this.request.params.bookId as string;
      const data   = await reviewService.list(bookId);
      return this.response.status(200).json({ data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async upsert() {
    try {
      const bookId           = this.request.params.bookId as string;
      const userId           = this.request.userId!;
      const { content, note } = this.request.body as { content?: string; note?: number };
      const data             = await reviewService.upsert(bookId, userId, content, note);
      return this.response.status(200).json({ message: "Review enregistrée", data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 400;
      return this.response.status(status).json({ message: error.message });
    }
  }

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
