import { Request, Response } from "express";

/**
 * Classe abstraite de base pour tous les contrôleurs de l'application.
 *
 * Chaque contrôleur hérite de cette classe et reçoit via le constructeur
 * les objets `request` et `response` d'Express, rendus accessibles
 * via `this.request` et `this.response` dans les méthodes enfants.
 *
 * Utilisation dans les routes :
 *   const controller = new MonController(req, res);
 *   controller.maMethode();
 */
export abstract class Controller {
  protected request: Request;
  protected response: Response;

  constructor(request: Request, response: Response) {
    this.request = request;
    this.response = response;
  }
}
