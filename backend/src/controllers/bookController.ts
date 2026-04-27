import BookService from "../services/BookService";
import { Controller } from "../libs/Controller";
import { AppError } from "../libs/AppError";

const bookService = new BookService();

export default class BookController extends Controller {
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
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async getById() {
    try {
      const id = this.request.params.id as string;
      const data = await bookService.getById(id);
      return this.response.status(200).json({ data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async create() {
    try {
      const data = await bookService.create(this.request.body);
      return this.response.status(201).json({ message: "Livre créé", data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 400;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async update() {
    try {
      const id = this.request.params.id as string;
      const data = await bookService.update(id, this.request.body);
      return this.response
        .status(200)
        .json({ message: "Livre mis à jour", data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 400;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async remove() {
    try {
      const id = this.request.params.id as string;
      await bookService.remove(id);
      return this.response.status(200).json({ message: "Livre supprimé" });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async search() {
    try {
      const { q } = this.request.validatedQuery as { q: string };
      const data = await bookService.search(q);
      return this.response.status(200).json({ data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async toggleRead() {
    try {
      const userId = this.request.userId!;
      const bookId = this.request.params.id as string;
      const result = await bookService.toggleRead(bookId, userId);
      return this.response.status(200).json(result);
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 400;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async toggleLike() {
    try {
      const userId = this.request.userId!;
      const bookId = this.request.params.id as string;
      const result = await bookService.toggleLike(bookId, userId);
      return this.response.status(200).json(result);
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 400;
      return this.response.status(status).json({ message: error.message });
    }
  }
}
