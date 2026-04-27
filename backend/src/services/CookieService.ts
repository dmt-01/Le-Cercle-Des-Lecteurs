import { TokenService } from "./TokenService";
import { Response } from "express";

/**
 * Service gérant le dépôt et la suppression des cookies d'authentification.
 */
export class CookieService {
  /**
   * Dépose le JWT de rafraîchissement dans un cookie httpOnly sécurisé.
   * @param response - Objet réponse Express
   * @param jwt     - Valeur brute du JWT à stocker dans le cookie
   */
  static setRefreshCookie(response: Response, jwt: string): void {
    response.cookie("refresh_token", jwt, {
      httpOnly: true, // Inaccessible depuis JavaScript côté client
      secure: process.env.NODE_ENV === "prod", // HTTPS uniquement en production
      sameSite: "strict", // Protection contre les attaques CSRF
      maxAge: TokenService.getRefreshTokenTTL() * 1000, // Durée de vie en millisecondes
    });
  }

  /**
   * Efface le cookie refresh_token côté client.
   * Appelé lors de la déconnexion.
   * @param response - Objet réponse Express
   */
  static clearRefreshCookie(response: Response): void {
    response.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      sameSite: "strict",
    });
  }
}
