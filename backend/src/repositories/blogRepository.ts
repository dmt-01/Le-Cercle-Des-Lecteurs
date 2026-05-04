import prisma from "../libs/prisma";

/**
 * Repository gérant les accès en base de données pour les articles de blog.
 */
export default class BlogRepository {
  /**
   * Retourne tous les articles, du plus récent au plus ancien.
   */
  async findAll() {
    return await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, username: true, profileImage: true } },
      },
    });
  }

  /**
   * Retourne le détail d'un article.
   * @param id - UUID de l'article
   */
  async findById(id: string) {
    return await prisma.blog.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, profileImage: true } },
      },
    });
  }

  /**
   * Publie un nouvel article.
   * @param data - Données de l'article
   */
  async create(data: {
    title: string;
    content?: string;
    category?: string;
    userId: string;
  }) {
    return await prisma.blog.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
        userId: data.userId,
      },
      include: {
        user: { select: { id: true, username: true, profileImage: true } },
      },
    });
  }
}
