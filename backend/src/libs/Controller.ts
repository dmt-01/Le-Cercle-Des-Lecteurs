import { Request, Response, NextFunction } from "express";

/**
 * Classe abstraite de base pour tous les contrôleurs de l'application.
 *
 * Chaque contrôleur hérite de cette classe et reçoit via le constructeur
 * les objets `request`, `response` et `next` d'Express, rendus accessibles
 * via `this.request`, `this.response` et `this.next` dans les méthodes enfants.
 *
 * Utilisation dans les routes :
 *   const controller = new MonController(req, res, next);
 *   controller.maMethode();
 */
export abstract class Controller {
  protected request: Request;
  protected response: Response;
  protected next: NextFunction;

  constructor(request: Request, response: Response, next: NextFunction) {
    this.request = request;
    this.response = response;
    this.next = next;
  }
}
