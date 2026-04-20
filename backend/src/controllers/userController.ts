import UserRepository from "../repositories/userRepository";
import UserService from "../services/userService";
import { Controller } from "../libs/Controller";
import User from "../modeles/User";
import Token from "../modeles/Token";
import TokenRepository from "../repositories/tokenRepository";
import { TokenService } from "../services/TokenService";
import { CookieService } from "../services/CookieService";
import argon2 from "argon2";

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
   * • Signe un JWT de rafraîchissement et enregistre le token
   * • Dépose le JWT en cookie httpOnly
   *
   * Réponses : 409 | 400 | 201
   */
  async signup() {
    try {
      // 0.0 REQUEST : Récupérer les données du corps validées par le middleware
      const data: { username: string; email: string; password: string; bio?: string; profile_image?: string } = this.request.body;

      // 1.1 USER : Vérifier qu'aucun utilisateur n'existe déjà avec cet email
      const userRepository = new UserRepository();
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

      // 2.1 TOKEN : Signer le JWT et créer une instance du token
      const jwt = TokenService.signRefreshToken({ sub: createdUser.id });
      const token = Token.create(createdUser.id, jwt);

      // 2.2 TOKEN : Enregistrer le token en base
      const tokenRepository = new TokenRepository();
      await tokenRepository.create(token);

      // 3 RESPONSE : Attacher le cookie et renvoyer les données de l'utilisateur
      CookieService.setRefreshCookie(this.response, jwt);

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
        data: userInstance.serialize(),
      });
    } catch (error: any) {
      this.response.status(400).json({ message: error.message });
    }
  }

  /**
   * Connexion d'un utilisateur existant
   *
   * • Reçoit un corps déjà validé par le middleware Zod
   * • Vérifie l'existence de l'utilisateur par email
   * • Compare le mot de passe soumis avec le hash enregistré
   * • Signe un nouveau JWT et enregistre le token
   * • Dépose le JWT en cookie httpOnly
   *
   * Réponses : 401 | 400 | 200
   */
  async signin() {
    try {
      // 0.0 REQUEST : Récupérer les données du corps validées par le middleware
      const data: { email: string; password: string } = this.request.body;

      // 1.1 USER : Rechercher l'utilisateur par email
      const userRepository = new UserRepository();
      const foundUser = await userRepository.findByEmail(data.email);

      if (!foundUser) {
        // Message volontairement identique pour ne pas révéler si l'email existe
        return this.response
          .status(401)
          .json({ message: "Email ou mot de passe incorrect" });
      }

      // 1.2 USER : Vérifier la concordance entre le mot de passe soumis et le hash enregistré
      const isPasswordValid = await argon2.verify(foundUser.passwordHash, data.password);

      if (!isPasswordValid) {
        return this.response
          .status(401)
          .json({ message: "Email ou mot de passe incorrect" });
      }

      // 2.1 TOKEN : Signer le JWT et créer une instance du token
      const jwt = TokenService.signRefreshToken({ sub: foundUser.id });
      const token = Token.create(foundUser.id, jwt);

      // 2.2 TOKEN : Enregistrer le token en base
      const tokenRepository = new TokenRepository();
      await tokenRepository.create(token);

      // 3 RESPONSE : Attacher le cookie et renvoyer les données de l'utilisateur
      CookieService.setRefreshCookie(this.response, jwt);

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
        data: userInstance.serialize(),
      });
    } catch (error: any) {
      this.response.status(400).json({ message: error.message });
    }
  }

  /**
   * Rafraîchissement du token de session
   *
   * • Protégée par requireAuth (userId déjà vérifié et injecté)
   * • Génère un nouveau JWT et remplace l'ancien token en base (rotation)
   * • Met à jour le cookie httpOnly
   *
   * Réponses : 401 (géré par requireAuth) | 404 | 200
   */
  async refresh() {
    try {
      // 0.0 REQUEST : Récupérer l'userId injecté par le middleware requireAuth
      const userId = this.request.userId!;

      // 1.0 USER : Charger l'utilisateur depuis la base
      const userRepository = new UserRepository();
      const foundUser = await userRepository.findById(userId);

      if (!foundUser) {
        return this.response
          .status(404)
          .json({ message: "Utilisateur introuvable" });
      }

      // 2.1 TOKEN : Signer un nouveau JWT et créer l'instance token
      const jwt = TokenService.signRefreshToken({ sub: foundUser.id });
      const token = Token.create(foundUser.id, jwt);

      // 2.2 TOKEN : Remplacer l'ancien token en base (rotation)
      const tokenRepository = new TokenRepository();
      await tokenRepository.replaceForUser(token);

      // 3 RESPONSE : Mettre à jour le cookie et renvoyer les données utilisateur
      CookieService.setRefreshCookie(this.response, jwt);

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
        data: userInstance.serialize(),
      });
    } catch (error: any) {
      this.response.status(400).json({ message: error.message });
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
      // 0.0 REQUEST : Récupérer l'userId injecté par le middleware requireAuth
      const userId = this.request.userId!;

      // 1.0 TOKEN : Supprimer le token en base
      const tokenRepository = new TokenRepository();
      await tokenRepository.deleteByUserId(userId);

      // 2.0 RESPONSE : Effacer le cookie et confirmer la déconnexion
      CookieService.clearRefreshCookie(this.response);

      return this.response.status(200).json({ message: "Déconnexion réussie" });
    } catch (error: any) {
      this.response.status(400).json({ message: error.message });
    }
  }
}
