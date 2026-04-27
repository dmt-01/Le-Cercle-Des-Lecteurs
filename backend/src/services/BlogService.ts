import BlogRepository from "../repositories/blogRepository";
import { AppError } from "../libs/AppError";

const blogRepository = new BlogRepository();

export default class BlogService {
  async list() {
    const rows = await blogRepository.findAll();
    return rows.map((a) => ({
      id: a.id,
      title: a.title,
      category: a.category ?? null,
      created_at: a.createdAt,
      author: a.user,
    }));
  }

  async getById(id: string) {
    const row = await blogRepository.findById(id);
    if (!row) throw new AppError("Article introuvable", 404);
    return {
      id: row.id,
      title: row.title,
      content: row.content ?? null,
      category: row.category ?? null,
      created_at: row.createdAt,
      author: row.user,
    };
  }

  async create(data: {
    title: string;
    content: string;
    category?: string;
    userId: string;
  }) {
    const article = await blogRepository.create(data);
    return {
      id: article.id,
      title: article.title,
      content: article.content ?? null,
      category: article.category ?? null,
      created_at: article.createdAt,
      author: article.user,
    };
  }
}
