import BlogService from "../services/BlogService";
import { Controller } from "../libs/Controller";

const blogService = new BlogService();

/** Contrôleur gérant les requêtes HTTP pour les articles de blog. */
export default class BlogController extends Controller {
  /** GET /blog — Retourne la liste de tous les articles. Réponses : 200 | 500 */
  async list() {
    try {
      const data = await blogService.list();
      return this.response.status(200).json({ data });
    } catch (error) {
      this.next(error);
    }
  }

  /** GET /blog/:id — Retourne le détail d'un article. Réponses : 200 | 404 | 500 */
  async getById() {
    try {
      const id = this.request.params.id as string;
      const data = await blogService.getById(id);
      return this.response.status(200).json({ data });
    } catch (error) {
      this.next(error);
    }
  }

  /** POST /blog — Publie un nouvel article (authentifié). Réponses : 201 | 400 */
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
    } catch (error) {
      this.next(error);
    }
  }
}
