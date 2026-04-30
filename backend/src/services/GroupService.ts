import GroupRepository from "../repositories/groupRepository";
import { AppError } from "../libs/AppError";

const groupRepository = new GroupRepository();

/** Service gérant la logique métier liée aux cercles de lecture. */
export default class GroupService {
  /** Retourne tous les clubs publics avec leur nombre de membres et de messages. */
  async list() {
    const rows = await groupRepository.findAll();
    return rows.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      access_club: g.accessClub,
      created_at: g.created_at,
      member_count: g._count.members,
      message_count: g._count.messages,
    }));
  }

  /**
   * Retourne le détail d'un club avec ses membres et ses 50 derniers messages.
   * @param id - UUID du club
   */
  async getById(id: string) {
    const row = await groupRepository.findById(id);
    if (!row) throw new AppError("Club introuvable", 404);
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      access_club: row.accessClub,
      created_at: row.created_at,
      member_count: row._count.members,
      members: row.members.map((m) => ({
        user: m.user,
        role: m.role,
      })),
      messages: row.messages.map((msg) => ({
        content: msg.content,
        created_at: msg.createdAt,
        user: msg.user,
      })),
    };
  }

  /**
   * Crée un nouveau club et inscrit son créateur comme admin.
   * @param data - Données du club + userId du créateur
   */
  async create(data: {
    name: string;
    description?: string;
    accessClub?: boolean;
    userId: string;
  }) {
    const group = await groupRepository.create(data);
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      access_club: group.accessClub,
      created_at: group.created_at,
      member_count: group._count.members,
    };
  }

  /**
   * Inscrit un utilisateur dans un club (vérifie que le club existe).
   * @param groupId - UUID du club
   * @param userId  - UUID de l'utilisateur
   */
  async join(groupId: string, userId: string) {
    const group = await groupRepository.findById(groupId);
    if (!group) throw new AppError("Club introuvable", 404);

    const result = await groupRepository.join(groupId, userId);
    if (!result) throw new AppError("Vous êtes déjà membre de ce club", 409);
  }

  /**
   * Retire un utilisateur d'un club.
   * @param groupId - UUID du club
   * @param userId  - UUID de l'utilisateur
   */
  async leave(groupId: string, userId: string) {
    const left = await groupRepository.leave(groupId, userId);
    if (!left) throw new AppError("Vous n'êtes pas membre de ce club", 404);
  }

  /**
   * Envoie un message dans le fil de discussion d'un club.
   * Vérifie que l'expéditeur est bien membre avant d'envoyer.
   * @param groupId - UUID du club
   * @param userId  - UUID de l'expéditeur
   * @param content - Contenu du message
   */
  async sendMessage(groupId: string, userId: string, content: string) {
    const isMember = await groupRepository.isMember(groupId, userId);
    if (!isMember)
      throw new AppError(
        "Vous devez être membre du club pour envoyer un message",
        403,
      );

    const msg = await groupRepository.addMessage(groupId, userId, content);
    return {
      content: msg.content,
      created_at: msg.createdAt,
      user: msg.user,
    };
  }
}
