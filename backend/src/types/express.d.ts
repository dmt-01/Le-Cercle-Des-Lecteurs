/**
 * Extension du type Request d'Express.
 *
 * Permet d'attacher l'identifiant de l'utilisateur authentifié directement
 * sur l'objet req, après vérification par le middleware requireAuth.
 *
 * Utilisation dans un contrôleur protégé :
 *   const userId = this.request.userId;
 */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      // Données de query string validées et coercées par le middleware validate()
      // req.query contient toujours des strings ; validatedQuery contient les bons types Zod
      validatedQuery?: Record<string, any>;
    }
  }
}

export {};
