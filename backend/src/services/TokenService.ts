import jwt from "jsonwebtoken";

/**
 * Service gérant la création et la configuration des JWT de rafraîchissement.
 */
export class TokenService {
  /**
   * Retourne la durée de vie du refresh token en secondes.
   * Lue depuis la variable d'environnement JWT_REFRESH_TTL (défaut : 7 jours).
   */
  static getRefreshTokenTTL(): number {
    return parseInt(process.env.JWT_REFRESH_TTL ?? "604800");
  }

  /**
   * Signe et retourne un JWT de rafraîchissement.
   * @param payload - Objet contenant `sub` (identifiant de l'utilisateur)
   */
  static signRefreshToken(payload: { sub: string }): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("JWT_REFRESH_SECRET non défini");
    return jwt.sign(payload, secret, {
      expiresIn: TokenService.getRefreshTokenTTL(),
    });
  }
}
