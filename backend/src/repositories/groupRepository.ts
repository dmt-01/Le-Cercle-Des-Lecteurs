import prisma from "../libs/prisma";

/**
 * Repository gérant les accès en base de données pour les clubs de lecture.
 */
export default class GroupRepository {
  /**
   * Retourne tous les clubs publics avec le nombre de membres.
   */
  async findAll() {
    return await prisma.group.findMany({
      where: { accessClub: true },
      include: { _count: { select: { members: true, messages: true } } },
      orderBy: { created_at: "desc" },
    });
  }

  /**
   * Retourne le détail d'un club avec ses membres et ses 50 derniers messages.
   * @param id - UUID du club
   */
  async findById(id: string) {
    return await prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: { select: { id: true, username: true, profileImage: true } },
          },
        },
        messages: {
          take: 50,
          orderBy: { createdAt: "asc" },
          include: {
            user: { select: { id: true, username: true, profileImage: true } },
          },
        },
        _count: { select: { members: true, messages: true } },
      },
    });
  }

  /**
   * Crée un nouveau club et ajoute son créateur comme admin.
   * @param data - Données du club + userId du créateur
   */
  async create(data: {
    name: string;
    description?: string;
    accessClub?: boolean;
    userId: string;
  }) {
    return await prisma.group.create({
      data: {
        name: data.name,
        description: data.description,
        accessClub: data.accessClub ?? true,
        members: { create: { userId: data.userId, role: "admin" } },
      },
      include: { _count: { select: { members: true } } },
    });
  }

  /**
   * Vérifie si un utilisateur est membre du club.
   */
  async isMember(groupId: string, userId: string): Promise<boolean> {
    const member = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    return !!member;
  }

  /**
   * Vérifie si un utilisateur est admin ou modérateur du club.
   */
  async isAdmin(groupId: string, userId: string): Promise<boolean> {
    const member = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    return member?.role === "admin" || member?.role === "moderator";
  }

  /**
   * Ajoute un utilisateur au club en tant que membre.
   * @returns Le membership créé ou null si déjà membre
   */
  async join(groupId: string, userId: string) {
    try {
      return await prisma.groupMember.create({
        data: { groupId, userId, role: "member" },
      });
    } catch {
      return null;
    }
  }

  /**
   * Retire un utilisateur du club.
   * @returns true si retiré, false si introuvable
   */
  async leave(groupId: string, userId: string): Promise<boolean> {
    try {
      await prisma.groupMember.delete({
        where: { groupId_userId: { groupId, userId } },
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Envoie un message dans le club.
   */
  async addMessage(groupId: string, userId: string, content: string) {
    return await prisma.groupMessage.create({
      data: { groupId, userId, content },
      include: {
        user: { select: { id: true, username: true, profileImage: true } },
      },
    });
  }
}
