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
    }
  }
}

export {};
