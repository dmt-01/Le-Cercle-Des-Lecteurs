/**
 * Interfaces TypeScript partagées dans l'application.
 * Ces types représentent la structure des données telles qu'elles sont
 * retournées par la base de données (avant d'être encapsulées dans un modèle).
 */

/**
 * Structure d'une ligne utilisateur retournée par la base de données.
 * Utilisée par User.fromRow() pour reconstruire une instance User depuis un résultat Prisma.
 */
export interface UserDbRow {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  bio?: string;
  profile_image?: string;
  created_at: string;
}
