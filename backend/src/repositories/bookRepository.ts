import prisma from "../libs/prisma";

/**
 * Include Prisma réutilisé pour charger toutes les relations d'un livre.
 */
const bookIncludes = {
  authors: { include: { author: true } },
  categorisations: { include: { genre: true } },
  thematisations: { include: { tag: true } },
  _count: { select: { reviews: true } },
};

/**
 * Repository gérant les accès en base de données pour les livres.
 */
export default class BookRepository {

  /**
   * Retourne une liste paginée de livres avec filtres optionnels.
   * @param options - page, limit, genre, tag, author
   * @returns { books, total } — livres de la page + total pour la pagination
   */
  async findAll(options: {
    page?: number;
    limit?: number;
    genre?: string;
    tag?: string;
    author?: string;
  }) {
    const { page = 1, limit = 20, genre, tag, author } = options;
    const skip = (page - 1) * limit;

    // Construction des filtres dynamiques
    const where: any = {};

    if (genre) {
      where.categorisations = {
        some: { genre: { name: { contains: genre, mode: "insensitive" } } },
      };
    }
    if (tag) {
      where.thematisations = {
        some: { tag: { name: { contains: tag, mode: "insensitive" } } },
      };
    }
    if (author) {
      where.authors = {
        some: { author: { name: { contains: author, mode: "insensitive" } } },
      };
    }

    // Transaction pour récupérer les livres et le total en une seule requête
    const [books, total] = await prisma.$transaction([
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        include: bookIncludes,
        orderBy: { created_at: "desc" },
      }),
      prisma.book.count({ where }),
    ]);

    return { books, total };
  }

  /**
   * Retourne le détail complet d'un livre avec ses relations et sa note moyenne.
   * @param id - UUID du livre
   * @returns Le livre enrichi ou null si introuvable
   */
  async findById(id: string) {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        ...bookIncludes,
        reviews: {
          select: {
            note: true,
            content: true,
            userId: true,
            createdAt: true,
          },
        },
      },
    });

    if (!book) return null;

    // Calculer la note moyenne depuis les reviews chargées
    const reviews = book.reviews;
    const notedReviews = reviews.filter((r) => r.note !== null);
    const averageRating =
      notedReviews.length > 0
        ? notedReviews.reduce((sum, r) => sum + r.note!, 0) / notedReviews.length
        : null;

    return { ...book, averageRating, reviewCount: reviews.length };
  }

  /**
   * Crée un nouveau livre avec ses relations (auteurs, genres, tags).
   * @param data - Données du livre à créer
   * @returns Le livre créé
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
    return await prisma.book.create({
      data: {
        title: data.title,
        coverImage: data.coverImage,
        description: data.description,
        publication_date: data.publicationDate ? new Date(data.publicationDate) : undefined,
        // Connexion aux auteurs, genres et tags existants via leurs ids
        authors: data.authorIds
          ? { create: data.authorIds.map((id) => ({ author: { connect: { id } } })) }
          : undefined,
        categorisations: data.genreIds
          ? { create: data.genreIds.map((id) => ({ genre: { connect: { id } } })) }
          : undefined,
        thematisations: data.tagIds
          ? { create: data.tagIds.map((id) => ({ tag: { connect: { id } } })) }
          : undefined,
      },
      include: bookIncludes,
    });
  }

  /**
   * Met à jour un livre existant.
   * @param id   - UUID du livre à modifier
   * @param data - Champs à mettre à jour (tous optionnels)
   * @returns Le livre mis à jour ou null si introuvable
   */
  async update(
    id: string,
    data: {
      title?: string;
      coverImage?: string;
      description?: string;
      publicationDate?: string;
    }
  ) {
    try {
      return await prisma.book.update({
        where: { id },
        data: {
          title: data.title,
          coverImage: data.coverImage,
          description: data.description,
          publication_date: data.publicationDate
            ? new Date(data.publicationDate)
            : undefined,
        },
        include: bookIncludes,
      });
    } catch {
      return null; // Retourne null si le livre n'existe pas
    }
  }

  /**
   * Supprime un livre par son id.
   * @param id - UUID du livre à supprimer
   * @returns true si supprimé, false si introuvable
   */
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.book.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Bascule l'état "lu" d'un livre pour un utilisateur.
   * @returns true si marqué comme lu, false si retiré
   */
  async toggleRead(bookId: string, userId: string): Promise<boolean> {
    const existing = await prisma.read.findUnique({
      where: { bookId_userId: { bookId, userId } },
    });
    if (existing) {
      await prisma.read.delete({ where: { bookId_userId: { bookId, userId } } });
      return false;
    }
    await prisma.read.create({ data: { bookId, userId } });
    return true;
  }

  /**
   * Bascule le like d'un livre pour un utilisateur.
   * @returns true si liké, false si retiré
   */
  async toggleLike(bookId: string, userId: string): Promise<boolean> {
    const existing = await prisma.like.findUnique({
      where: { bookId_userId: { bookId, userId } },
    });
    if (existing) {
      await prisma.like.delete({ where: { bookId_userId: { bookId, userId } } });
      return false;
    }
    await prisma.like.create({ data: { bookId, userId } });
    return true;
  }

  /**
   * Recherche des livres par titre ou nom d'auteur (insensible à la casse).
   * @param query - Terme de recherche
   * @returns Liste des livres correspondants (max 20)
   */
  async search(query: string) {
    return await prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          {
            authors: {
              some: {
                author: { name: { contains: query, mode: "insensitive" } },
              },
            },
          },
        ],
      },
      include: bookIncludes,
      take: 20,
      orderBy: { title: "asc" },
    });
  }
}
