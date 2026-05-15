import EventService from "../services/EventService";
import { Controller } from "../libs/Controller";

const eventService = new EventService();

/** Contrôleur gérant les requêtes HTTP pour les événements littéraires. */
export default class EventController extends Controller {
  /** GET /events — Retourne tous les événements à venir. Réponses : 200 | 500 */
  async list() {
    try {
      const data = await eventService.list();
      return this.response.status(200).json({ data });
    } catch (error) {
      this.next(error);
    }
  }

  /** GET /events/:id — Retourne le détail d'un événement. Réponses : 200 | 404 | 500 */
  async getById() {
    try {
      const id = this.request.params.id as string;
      const data = await eventService.getById(id);
      return this.response.status(200).json({ data });
    } catch (error) {
      this.next(error);
    }
  }

  /** POST /events — Crée un événement (admin/modérateur du club). Réponses : 201 | 403 | 400 */
  async create() {
    try {
      const userId = this.request.userId!;
      const data = this.request.body as {
        title: string;
        description: string;
        eventDate: string;
        link?: string;
        groupId: string;
      };
      const result = await eventService.create(data, userId);
      return this.response
        .status(201)
        .json({ message: "Événement créé", data: result });
    } catch (error) {
      this.next(error);
    }
  }
}
