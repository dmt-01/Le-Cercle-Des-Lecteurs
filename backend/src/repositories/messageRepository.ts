import prisma from "../libs/prisma";

/**
 * Repository gérant les accès en base de données pour la messagerie privée.
 */
export default class MessageRepository {
  /**
   * Retourne la liste des conversations d'un utilisateur.
   * Chaque conversation est représentée par son dernier message.
   * @param userId - UUID de l'utilisateur connecté
   */
  async findConversations(userId: string) {
    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      orderBy: { sentAt: "desc" },
      include: {
        sender: { select: { id: true, username: true, profileImage: true } },
        receiver: { select: { id: true, username: true, profileImage: true } },
      },
    });

    // Dédupliquer par partenaire de conversation — garder uniquement le dernier message
    const seen = new Set<string>();
    return messages.filter((message) => {
      const partnerId =
        message.senderId === userId ? message.receiverId : message.senderId;
      if (seen.has(partnerId)) return false;
      seen.add(partnerId);
      return true;
    });
  }

  /**
   * Retourne tous les messages échangés entre deux utilisateurs (ordre chronologique).
   * @param userId    - UUID de l'utilisateur connecté
   * @param partnerId - UUID du correspondant
   */
  async findConversation(userId: string, partnerId: string) {
    return await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ],
      },
      orderBy: { sentAt: "asc" },
      include: {
        sender: { select: { id: true, username: true, profileImage: true } },
      },
    });
  }

  /**
   * Envoie un message privé.
   * @param senderId   - UUID de l'expéditeur
   * @param receiverId - UUID du destinataire
   * @param content    - Contenu du message
   */
  async send(senderId: string, receiverId: string, content: string) {
    return await prisma.message.create({
      data: { senderId, receiverId, content },
      include: {
        sender: { select: { id: true, username: true } },
        receiver: { select: { id: true, username: true } },
      },
    });
  }

  /**
   * Marque tous les messages non lus d'une conversation comme lus.
   * @param senderId   - UUID de l'expéditeur des messages à marquer
   * @param receiverId - UUID du destinataire (utilisateur connecté)
   */
  async markAsRead(senderId: string, receiverId: string) {
    await prisma.message.updateMany({
      where: { senderId, receiverId, read: false },
      data: { read: true },
    });
  }
}
