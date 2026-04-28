import {ReviewDbRow } from "../types/Types";

/**
 * Modèle représentant une review (avis) laissée par un utilisateur sur un livre.
 *
 * La clé primaire en base est composite : [bookId, userId].
 * Un utilisateur ne peut donc laisser qu'une seule review par livre.
 */
export default class Review {
  protected bookId: string;
  protected userId: string;
  protected content?: string;
  protected note?: number;
  protected createdAt: string;

  /**
   * @param bookId    - UUID du livre concerné
   * @param userId    - UUID de l'auteur de la review
   * @param createdAt - Date de création ISO
   * @param content   - Texte de la review (optionnel)
   * @param note      - Note de 1 à 5 (optionnel)
   */
  constructor(
    bookId: string,
    userId: string,
    createdAt: string,
    content?: string,
    note?: number,
  ) {
    this.bookId = bookId;
    this.userId = userId;
    this.createdAt = createdAt;
    this.content = content;
    this.note = note;
  }

  /**
   * Reconstruit une instance Review depuis un résultat Prisma.
   */
  static fromRow(row: ReviewDbRow): Review {
    return new Review(
      row.bookId,
      row.userId,
      row.createdAt?.toISOString() ?? row.createdAt,
      row.content ?? undefined,
      row.note ?? undefined,
    );
  }

  /**
   * Sérialise la review pour la réponse HTTP.
   */
  serialize(): Record<string, unknown> {
    return {
      book_id: this.bookId,
      user_id: this.userId,
      content: this.content ?? null,
      note: this.note ?? null,
      created_at: this.createdAt,
    };
  }
}
