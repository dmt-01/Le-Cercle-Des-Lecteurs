import TokenRepository from "../repositories/tokenRepository";
import { Request, Response, NextFunction } from "express";
import Token from "../modeles/Token";
import jwt from "jsonwebtoken";

/**
 * Middleware de protection des routes authentifiées.
 *
 * Vérifie que la requête provient d'un utilisateur connecté en :
 *  1. Lisant le cookie refresh_token
 *  2. Vérifiant la signature JWT
 *  3. Retrouvant le token en base via son hash SHA-256
 *  4. Vérifiant que le token n'est pas expiré
 *  5. Injectant l'userId dans req pour les contrôleurs suivants
 *
 * Renvoie 401 si l'une des vérifications échoue.
 *
 * Utilisation sur une route :
 *   router.post("/refresh", requireAuth, (req, res) => { ... });
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // 0.0 COOKIE : Lire le refresh token depuis le cookie httpOnly
    const rawJwt: string | undefined = req.cookies.refresh_token;

    if (!rawJwt) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    // 1.0 JWT : Vérifier la signature — jwt.verify lance une exception si invalide ou expiré
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("JWT_REFRESH_SECRET non défini");

    try {
      jwt.verify(rawJwt, secret);
    } catch {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }

    // 2.0 TOKEN : Hasher le JWT reçu et le comparer avec ce qui est stocké en base
    const hash = Token.hashJwt(rawJwt);
    const tokenRepository = new TokenRepository();
    const storedToken = await tokenRepository.findByHash(hash);

    if (!storedToken) {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }

    // 3.0 EXPIRY : Vérifier que la date d'expiration n'est pas dépassée
    if (new Date() > storedToken.expiresAt) {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }

    // 4.0 REQUEST : Injecter l'userId dans la requête pour les contrôleurs suivants
    req.userId = storedToken.userId;
    next();
  } catch (error: any) {
    res.status(401).json({ message: "Non authentifié" });
  }
}
