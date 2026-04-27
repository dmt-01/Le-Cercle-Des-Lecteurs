import BlogService from "../services/BlogService";
import { Controller } from "../libs/Controller";
import { AppError } from "../libs/AppError";

const blogService = new BlogService();

export default class BlogController extends Controller {
  async list() {
    try {
      const data = await blogService.list();
      return this.response.status(200).json({ data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async getById() {
    try {
      const id = this.request.params.id as string;
      const data = await blogService.getById(id);
      return this.response.status(200).json({ data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async create() {
    try {
      const userId = this.request.userId!;
      const { title, content, category } = this.request.body as {
        title: string;
        content: string;
        category?: string;
      };
      const data = await blogService.create({
        title,
        content,
        category,
        userId,
      });
      return this.response
        .status(201)
        .json({ message: "Article publié", data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 400;
      return this.response.status(status).json({ message: error.message });
    }
  }
}
