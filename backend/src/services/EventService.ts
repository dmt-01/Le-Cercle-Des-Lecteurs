import EventRepository from "../repositories/eventRepository";
import GroupRepository from "../repositories/groupRepository";
import { AppError } from "../libs/AppError";

const eventRepository = new EventRepository();
const groupRepository = new GroupRepository();

/** Service gérant la logique métier liée aux événements littéraires. */
export default class EventService {
  /** Retourne tous les événements à venir avec leur groupe organisateur. */
  async list() {
    const rows = await eventRepository.findAll();
    return rows.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      event_date: e.eventDate,
      link: e.link ?? null,
      group: e.group,
    }));
  }

  /**
   * Retourne le détail d'un événement.
   * @param id - UUID de l'événement
   */
  async getById(id: string) {
    const row = await eventRepository.findById(id);
    if (!row) throw new AppError("Événement introuvable", 404);
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      event_date: row.eventDate,
      link: row.link ?? null,
      group: row.group,
    };
  }

  /**
   * Crée un événement pour un club. Réservé aux admins et modérateurs.
   * @param data   - Données de l'événement (titre, description, date, lien, groupId)
   * @param userId - UUID de l'utilisateur qui crée l'événement (doit être admin/modérateur)
   */
  async create(
    data: {
      title: string;
      description: string;
      eventDate: string;
      link?: string;
      groupId: string;
    },
    userId: string,
  ) {
    const isAdmin = await groupRepository.isAdmin(data.groupId, userId);
    if (!isAdmin)
      throw new AppError("Réservé aux admins et modérateurs du club", 403);

    const event = await eventRepository.create(data);
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      event_date: event.eventDate,
      link: event.link ?? null,
      group: event.group,
    };
  }
}
