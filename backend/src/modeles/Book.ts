/**
 * Modèle représentant un livre de l'application.
 *
 * Peut contenir des données enrichies (auteurs, genres, tags, notes)
 * chargées via les includes Prisma dans le repository.
 */
export default class Book {
  protected id: string;
  protected title: string;
  protected coverImage?: string;
  protected description?: string;
  protected publicationDate?: string;
  protected createdAt: string;
  // Données enrichies — présentes uniquement quand chargées par le repository
  protected authors?: { id: string; name: string }[];
  protected genres?: { id: string; name: string }[];
  protected tags?: { id: string; name: string }[];
  protected averageRating?: number;
  protected reviewCount?: number;

  /**
   * @param id              - UUID du livre
   * @param title           - Titre
   * @param coverImage      - URL de la couverture (optionnel)
   * @param description     - Description (optionnel)
   * @param publicationDate - Date de publication ISO (optionnel)
   * @param createdAt       - Date de création ISO
   * @param authors         - Liste des auteurs (optionnel)
   * @param genres          - Liste des genres (optionnel)
   * @param tags            - Liste des tags (optionnel)
   * @param averageRating   - Note moyenne calculée depuis les reviews (optionnel)
   * @param reviewCount     - Nombre de reviews (optionnel)
   */
  constructor(
    id: string,
    title: string,
    createdAt: string,
    coverImage?: string,
    description?: string,
    publicationDate?: string,
    authors?: { id: string; name: string }[],
    genres?: { id: string; name: string }[],
    tags?: { id: string; name: string }[],
    averageRating?: number,
    reviewCount?: number,
  ) {
    this.id = id;
    this.title = title;
    this.createdAt = createdAt;
    this.coverImage = coverImage;
    this.description = description;
    this.publicationDate = publicationDate;
    this.authors = authors;
    this.genres = genres;
    this.tags = tags;
    this.averageRating = averageRating;
    this.reviewCount = reviewCount;
  }

  /**
   * Reconstruit une instance Book depuis un résultat Prisma enrichi.
   * Les relations authors/genres/tags sont aplaties pour la sérialisation.
   */
  static fromRow(row: any): Book {
    return new Book(
      row.id,
      row.title,
      row.created_at?.toISOString() ?? row.created_at,
      row.coverImage ?? undefined,
      row.description ?? undefined,
      row.publication_date?.toISOString() ?? undefined,
      row.authors?.map((author: any) => ({
        id: author.author.id,
        name: author.author.name,
      })),
      row.categorisations?.map((categorie: any) => ({
        id: categorie.genre.id,
        name: categorie.genre.name,
      })),
      row.thematisations?.map((theme: any) => ({
        id: theme.tag.id,
        name: theme.tag.name,
      })),
      row.averageRating ?? undefined,
      row.reviewCount ?? row._count?.reviews ?? undefined,
    );
  }

  /**
   * Sérialise le livre pour la réponse HTTP.
   */
  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      title: this.title,
      cover_image: this.coverImage,
      description: this.description,
      publication_date: this.publicationDate,
      created_at: this.createdAt,
      authors: this.authors,
      genres: this.genres,
      tags: this.tags,
      average_rating: this.averageRating ?? null,
      review_count: this.reviewCount ?? 0,
    };
  }

  // Getters
  getId = (): string => this.id;
  getTitle = (): string => this.title;
}
