import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Middleware d'authentification optionnelle.
 *
 * Même logique que requireAuth, mais ne bloque pas si le header est absent ou invalide.
 * Utile pour les routes publiques qui personnalisent leur réponse selon l'utilisateur connecté
 * (ex : GET /users/:id retourne is_following si l'appelant est connecté).
 *
 * Utilisation sur une route :
 *   router.get("/:id", optionalAuth, (req, res) => { ... });
 */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return next();

    const rawJwt = authHeader.slice(7);
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) return next();

    try {
      const decoded = jwt.verify(rawJwt, secret) as { sub: string };
      req.userId = decoded.sub;
    } catch {
      // Token invalide ou expiré — on continue sans userId
    }
    next();
  } catch {
    next();
  }
}

/**
 * Middleware de protection des routes authentifiées.
 *
 * Vérifie que la requête provient d'un utilisateur connecté en :
 *  1. Lisant le header Authorization: Bearer <access_token>
 *  2. Vérifiant la signature JWT avec JWT_ACCESS_SECRET
 *  3. Injectant l'userId dans req pour les contrôleurs suivants
 *
 * L'access token est stateless : pas de vérification en base (il expire au bout de 15 min).
 * La révocation se gère via le refresh token (stocké en base).
 *
 * Renvoie 401 si le header est absent ou le token invalide/expiré.
 *
 * Utilisation sur une route :
 *   router.get("/me", requireAuth, (req, res) => { ... });
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // 1.0 HEADER : Lire l'access token depuis le header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const rawJwt = authHeader.slice(7);

    // 2.0 JWT : Vérifier la signature — jwt.verify lance une exception si invalide ou expiré
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw new Error("JWT_ACCESS_SECRET non défini");

    let decoded: { sub: string };
    try {
      decoded = jwt.verify(rawJwt, secret) as { sub: string };
    } catch {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }

    // 3.0 REQUEST : Injecter l'userId dans la requête pour les contrôleurs suivants
    req.userId = decoded.sub;
    next();
  } catch {
    res.status(401).json({ message: "Non authentifié" });
  }
}
