import TokenRepository from "../repositories/tokenRepository";
import UserRepository from "../repositories/userRepository";
import { CookieService } from "../services/CookieService";
import { TokenService } from "../services/TokenService";
import UserService from "../services/userService";
import { Controller } from "../libs/Controller";
import Token from "../modeles/Token";
import User from "../modeles/User";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

const userRepository = new UserRepository();
const tokenRepository = new TokenRepository();

/**
 * Contrôleur gérant l'authentification des utilisateurs.
 * Hérite de Controller qui expose this.request et this.response.
 */
export default class UserController extends Controller {
  /**
   * Inscription d'un nouvel utilisateur
   *
   * • Reçoit un corps déjà validé par le middleware Zod
   * • Vérifie que l'email n'est pas déjà utilisé
   * • Hash le mot de passe et crée l'utilisateur en base
   * • Signe un refresh token (cookie httpOnly) et un access token (body)
   * • Enregistre le refresh token en base
   *
   * Réponses : 409 | 400 | 201
   */
  async signup() {
    try {
      // 0.0 REQUEST : Récupérer les données du corps validées par le middleware
      const data: {
        username: string;
        email: string;
        password: string;
        bio?: string;
        profile_image?: string;
      } = this.request.body;

      // 1.1 USER : Vérifier qu'aucun utilisateur n'existe déjà avec cet email
      const existingUser = await userRepository.findByEmail(data.email);

      if (existingUser) {
        return this.response
          .status(409)
          .json({ message: "Utilisateur déjà existant" });
      }

      // 1.2 USER : Hasher le mot de passe et créer l'utilisateur en base
      const password_hash = await argon2.hash(data.password);
      const createdUser = await UserService.CreateUser({
        username: data.username,
        email: data.email,
        password_hash: password_hash,
        bio: data.bio,
        profile_image: data.profile_image,
      });

      if (!createdUser) {
        return this.response
          .status(400)
          .json({ message: "Création de l'utilisateur impossible" });
      }

      // 2.1 TOKEN : Signer les tokens et créer une instance du refresh token
      const refreshJwt = TokenService.signRefreshToken({ sub: createdUser.id });
      const accessToken = TokenService.signAccessToken({ sub: createdUser.id });
      const token = Token.create(createdUser.id, refreshJwt);

      // 2.2 TOKEN : Enregistrer le refresh token en base
      await tokenRepository.create(token);

      // 3 RESPONSE : Attacher le cookie et renvoyer les données de l'utilisateur
      CookieService.setRefreshCookie(this.response, refreshJwt);

      const userInstance = new User(
        createdUser.id,
        createdUser.username,
        createdUser.email,
        createdUser.passwordHash,
        createdUser.bio ?? undefined,
        createdUser.profileImage ?? undefined,
        createdUser.created_at.toISOString(),
      );

      return this.response.status(201).json({
        message: "Inscription réussie",
        accessToken,
        data: userInstance.serialize(),
      });
    } catch (error) {
      this.next(error);
    }
  }

  /**
   * Connexion d'un utilisateur existant
   *
   * • Reçoit un corps déjà validé par le middleware Zod
   * • Vérifie l'existence de l'utilisateur par email
   * • Compare le mot de passe soumis avec le hash enregistré
   * • Signe un refresh token (cookie httpOnly) et un access token (body)
   * • Enregistre le refresh token en base
   *
   * Réponses : 401 | 400 | 200
   */
  async signin() {
    try {
      // 0.0 REQUEST : Récupérer les données du corps validées par le middleware
      const data: { email: string; password: string } = this.request.body;

      // 1.1 USER : Rechercher l'utilisateur par email
      const foundUser = await userRepository.findByEmail(data.email);

      if (!foundUser) {
        // Message volontairement identique pour ne pas révéler si l'email existe
        return this.response
          .status(401)
          .json({ message: "Email ou mot de passe incorrect" });
      }

      // 1.2 USER : Vérifier la concordance entre le mot de passe soumis et le hash enregistré
      const isPasswordValid = await argon2.verify(
        foundUser.passwordHash,
        data.password,
      );

      if (!isPasswordValid) {
        return this.response
          .status(401)
          .json({ message: "Email ou mot de passe incorrect" });
      }

      // 2.1 TOKEN : Signer les tokens et créer une instance du refresh token
      const refreshJwt = TokenService.signRefreshToken({ sub: foundUser.id });
      const accessToken = TokenService.signAccessToken({ sub: foundUser.id });
      const token = Token.create(foundUser.id, refreshJwt);

      // 2.2 TOKEN : Enregistrer le refresh token en base
      await tokenRepository.create(token);

      // 3 RESPONSE : Attacher le cookie et renvoyer les données de l'utilisateur
      CookieService.setRefreshCookie(this.response, refreshJwt);

      const userInstance = new User(
        foundUser.id,
        foundUser.username,
        foundUser.email,
        foundUser.passwordHash,
        foundUser.bio ?? undefined,
        foundUser.profileImage ?? undefined,
        foundUser.created_at.toISOString(),
      );

      return this.response.status(200).json({
        message: "Connexion réussie",
        accessToken,
        data: userInstance.serialize(),
      });
    } catch (error) {
      this.next(error);
    }
  }

  /**
   * Rafraîchissement du token de session
   *
   * • Route publique — lit directement le cookie httpOnly (pas de requireAuth)
   * • Vérifie le refresh token (signature + présence en base + expiry)
   * • Génère un nouveau refresh token et un access token (rotation)
   * • Met à jour le cookie httpOnly et renvoie le nouvel access token dans le body
   *
   * Réponses : 401 | 404 | 200
   */
  async refresh() {
    try {
      // 0.0 COOKIE : Lire le refresh token depuis le cookie httpOnly
      const rawRefreshJwt: string | undefined =
        this.request.cookies.refresh_token;
      if (!rawRefreshJwt) {
        return this.response.status(401).json({ message: "Non authentifié" });
      }

      // 1.0 JWT : Vérifier la signature du refresh token
      const secret = process.env.JWT_REFRESH_SECRET;
      if (!secret) throw new Error("JWT_REFRESH_SECRET non défini");
      try {
        jwt.verify(rawRefreshJwt, secret);
      } catch {
        return this.response
          .status(401)
          .json({ message: "Token invalide ou expiré" });
      }

      // 2.0 TOKEN : Hasher et retrouver en base
      const hash = Token.hashJwt(rawRefreshJwt);
      const storedToken = await tokenRepository.findByHash(hash);
      if (!storedToken || new Date() > storedToken.expiresAt) {
        return this.response
          .status(401)
          .json({ message: "Token invalide ou expiré" });
      }

      // 3.0 USER : Charger l'utilisateur depuis la base
      const foundUser = await userRepository.findById(storedToken.userId);
      if (!foundUser) {
        return this.response
          .status(404)
          .json({ message: "Utilisateur introuvable" });
      }

      // 4.1 TOKEN : Émettre un nouveau refresh token + un access token
      const newRefreshJwt = TokenService.signRefreshToken({ sub: foundUser.id });
      const accessToken = TokenService.signAccessToken({ sub: foundUser.id });
      const token = Token.create(foundUser.id, newRefreshJwt);

      // 4.2 TOKEN : Remplacer l'ancien token en base (rotation)
      await tokenRepository.replaceForUser(token);

      // 5 RESPONSE : Mettre à jour le cookie et renvoyer les données utilisateur
      CookieService.setRefreshCookie(this.response, newRefreshJwt);

      const userInstance = new User(
        foundUser.id,
        foundUser.username,
        foundUser.email,
        foundUser.passwordHash,
        foundUser.bio ?? undefined,
        foundUser.profileImage ?? undefined,
        foundUser.created_at.toISOString(),
      );

      return this.response.status(200).json({
        message: "Token rafraîchi",
        accessToken,
        data: userInstance.serialize(),
      });
    } catch (error) {
      this.next(error);
    }
  }

  /**
   * Déconnexion de l'utilisateur
   *
   * • Protégée par requireAuth (userId déjà vérifié et injecté)
   * • Supprime le token en base
   * • Efface le cookie httpOnly côté client
   *
   * Réponses : 401 (géré par requireAuth) | 200
   */
  async logout() {
    try {
      const userId = this.request.userId!;

      await tokenRepository.deleteByUserId(userId);

      CookieService.clearRefreshCookie(this.response);

      return this.response.status(200).json({ message: "Déconnexion réussie" });
    } catch (error) {
      this.next(error);
    }
  }

  /**
   * Profil de l'utilisateur connecté.
   *
   * Réponses : 404 | 200
   */
  async getMe() {
    try {
      const userId = this.request.userId!;
      const data = await UserService.getMe(userId);
      return this.response.status(200).json({ data });
    } catch (error) {
      this.next(error);
    }
  }

  /** PUT /users/me — Met à jour le profil de l'utilisateur connecté. Réponses : 200 | 404 | 400 */
  async updateMe() {
    try {
      const userId = this.request.userId!;
      const data = await UserService.updateMe(userId, this.request.body);
      return this.response
        .status(200)
        .json({ message: "Profil mis à jour", data });
    } catch (error) {
      this.next(error);
    }
  }

  /** GET /users/:id — Retourne le profil public d'un utilisateur. Réponses : 200 | 404 | 500 */
  async getPublicProfile() {
    try {
      const id = this.request.params.id as string;
      // viewerId est injecté par optionalAuth s'il est connecté, undefined sinon
      const viewerId = this.request.userId;
      const data = await UserService.getPublicProfile(id, viewerId);
      return this.response.status(200).json({ data });
    } catch (error) {
      this.next(error);
    }
  }

  /** POST /users/:id/follow — Abonne l'utilisateur connecté à un autre. Réponses : 200 | 400 | 409 */
  async follow() {
    try {
      const userId = this.request.userId!;
      const userFollowedId = this.request.params.id as string;
      await UserService.follow(userId, userFollowedId);
      return this.response.status(200).json({ message: "Utilisateur suivi" });
    } catch (error) {
      this.next(error);
    }
  }

  /** DELETE /users/:id/follow — Désabonne l'utilisateur connecté d'un autre. Réponses : 200 | 404 | 400 */
  async unfollow() {
    try {
      const userId = this.request.userId!;
      const userFollowedId = this.request.params.id as string;
      await UserService.unfollow(userId, userFollowedId);
      return this.response
        .status(200)
        .json({ message: "Utilisateur non suivi" });
    } catch (error) {
      this.next(error);
    }
  }
}
