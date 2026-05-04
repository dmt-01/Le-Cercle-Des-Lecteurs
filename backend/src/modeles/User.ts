/**
 * Modèle représentant un utilisateur de l'application.
 *
 * Encapsule les données d'un utilisateur et expose des méthodes
 * pour y accéder de manière contrôlée (getters) et pour sérialiser
 * les données avant de les renvoyer en réponse HTTP.
 */
export default class User {
  protected id?: string; // UUID généré par la base — absent avant l'insertion
  protected username: string;
  protected email: string;
  protected password_hash: string; // Hash argon2 — jamais exposé dans serialize()
  protected bio?: string;
  protected profile_image?: string;
  protected created_at: string;

  /**
   * Crée une instance de User.
   * @param id            - UUID en base (optionnel — absent avant insertion en base)
   * @param username      - Pseudo de l'utilisateur
   * @param email         - Adresse email de l'utilisateur
   * @param password_hash - Hash du mot de passe (argon2)
   * @param bio           - Biographie de l'utilisateur (optionnelle)
   * @param profile_image - URL de l'image de profil (optionnelle)
   * @param created_at    - Date de création ISO (générée automatiquement si absente)
   */
  constructor(
    id: string | undefined,
    username: string,
    email: string,
    password_hash: string,
    bio?: string,
    profile_image?: string,
    created_at?: string,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
    this.bio = bio;
    this.profile_image = profile_image;
    this.created_at = created_at ?? new Date().toISOString();
  }

  /**
   * Sérialise l'utilisateur pour l'envoyer en réponse HTTP.
   * Le password_hash n'est jamais inclus — il ne doit jamais quitter le serveur.
   */
  serialize = (): Record<string, string | number | undefined> => {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      bio: this.bio,
      profile_image: this.profile_image,
      created_at: this.created_at,
    };
  };

  /**
   * Sérialise le profil public (sans email) pour GET /users/:id.
   */
  serializePublic = (): Record<string, string | undefined> => {
    return {
      id: this.id,
      username: this.username,
      bio: this.bio,
      profile_image: this.profile_image,
      created_at: this.created_at,
    };
  };

  // Getters — accès en lecture seule aux propriétés protégées
  getId = (): string | undefined => this.id;
  getUsername = (): string => this.username;
  getEmail = (): string => this.email;
  getPasswordHash = (): string => this.password_hash;
  getBio = (): string | undefined => this.bio;
  getProfileImage = (): string | undefined => this.profile_image;
  getCreatedAt = (): string => this.created_at;
}
