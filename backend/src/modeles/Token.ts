import crypto from "node:crypto";
import { TokenService } from "../services/TokenService";

/**
 * Modèle représentant un token d'authentification lié à un utilisateur.
 *
 * Le constructeur est privé : on ne peut pas faire `new Token(...)` depuis l'extérieur.
 * Il faut utiliser les méthodes statiques :
 *  - Token.create(userId, jwt)  → pour générer un nouveau token (inscription / connexion)
 *  - Token.fromRow(row)         → pour reconstruire un token depuis la base de données
 */
export default class Token {
  protected id?: number;           // Identifiant en base (absent avant l'insertion)
  protected user_id: string;       // UUID de l'utilisateur propriétaire
  protected token_hash: string;    // Hash SHA-256 du JWT — on ne stocke jamais le JWT brut
  protected expires_at: string;    // Date d'expiration en ISO string
  protected created_at: string;    // Date de création en ISO string

  /**
   * Constructeur privé — utilisé uniquement par les méthodes statiques de cette classe.
   */
  private constructor(
    user_id: string,
    token_hash: string,
    expires_at: string,
    created_at: string,
    id?: number
  ) {
    this.id = id;
    this.user_id = user_id;
    this.token_hash = token_hash;
    this.expires_at = expires_at;
    this.created_at = created_at;
  }

  /**
   * Génère un nouveau token pour un utilisateur à partir du JWT signé.
   * Calcule le hash SHA-256 du JWT et la date d'expiration.
   * @param userId - UUID de l'utilisateur
   * @param jwt    - JWT brut signé par TokenService
   */
  static create = (userId: string, jwt: string): Token => {
    // On hash le JWT pour ne jamais stocker sa valeur brute en base
    const hash = crypto.createHash("sha256").update(jwt).digest("hex");
    const created = new Date();
    const expires = new Date(
      created.getTime() + TokenService.getRefreshTokenTTL() * 1000
    );

    return new Token(
      userId,
      hash,
      expires.toISOString(),
      created.toISOString(),
      undefined
    );
  };

  /**
   * Reconstruit une instance Token à partir d'une ligne retournée par la base de données.
   * @param row - Enregistrement brut issu de Prisma
   */
  static fromRow = (row: Token): Token => {
    return new Token(
      row.user_id,
      row.token_hash,
      row.expires_at,
      row.created_at,
      row.id
    );
  };

  /**
   * Hashe un JWT brut en SHA-256.
   * Utile pour comparer un JWT reçu en cookie avec le hash stocké en base.
   * @param jwt - Valeur brute du JWT
   */
  static hashJwt = (jwt: string): string => {
    return crypto.createHash("sha256").update(jwt).digest("hex");
  };

  // Setter
  setId = (id: number): void => {
    this.id = id;
  };

  // Getters — accès en lecture seule aux propriétés protégées
  getId = (): number | undefined => this.id;
  getUserId = (): string => this.user_id;
  getTokenHash = (): string => this.token_hash;
  getExpiresAt = (): string => this.expires_at;
  getCreatedAt = (): string => this.created_at;

  /**
   * Indique si le token est expiré en comparant la date d'expiration avec maintenant.
   */
  isExpired = (): boolean => Date.now() >= Date.parse(this.expires_at);
}
