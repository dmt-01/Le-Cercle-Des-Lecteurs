import prisma from "../libs/prisma";

/**
 * Repository gérant les accès en base de données pour les événements.
 */
export default class EventRepository {

  /**
   * Retourne tous les événements à venir, triés par date.
   */
  async findAll() {
    return await prisma.event.findMany({
      where:   { eventDate: { gte: new Date() } },
      orderBy: { eventDate: "asc" },
      include: { group: { select: { id: true, name: true } } },
    });
  }

  /**
   * Retourne le détail d'un événement.
   * @param id - UUID de l'événement
   */
  async findById(id: string) {
    return await prisma.event.findUnique({
      where:   { id },
      include: { group: { select: { id: true, name: true } } },
    });
  }

  /**
   * Crée un nouvel événement dans un club.
   * @param data - Données de l'événement
   */
  async create(data: {
    title: string;
    description: string;
    eventDate: string;
    link?: string;
    groupId: string;
  }) {
    return await prisma.event.create({
      data: {
        title:       data.title,
        description: data.description,
        eventDate:   new Date(data.eventDate),
        link:        data.link,
        groupId:     data.groupId,
      },
      include: { group: { select: { id: true, name: true } } },
    });
  }
}
