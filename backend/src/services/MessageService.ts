import MessageRepository from "../repositories/messageRepository";
import { AppError } from "../libs/AppError";

const messageRepository = new MessageRepository();

export default class MessageService {
  async listConversations(userId: string) {
    const rows = await messageRepository.findConversations(userId);
    return rows.map((msg) => {
      const partner = msg.senderId === userId ? msg.receiver : msg.sender;
      return {
        partner,
        last_message: {
          content: msg.content,
          sent_at: msg.sentAt,
          read: msg.read,
          is_mine: msg.senderId === userId,
        },
      };
    });
  }

  async getConversation(userId: string, partnerId: string) {
    await messageRepository.markAsRead(partnerId, userId);
    const rows = await messageRepository.findConversation(userId, partnerId);
    return rows.map((msg) => ({
      id: msg.id,
      content: msg.content,
      sent_at: msg.sentAt,
      read: msg.read,
      is_mine: msg.senderId === userId,
      sender: msg.sender,
    }));
  }

  async send(senderId: string, receiverId: string, content: string) {
    if (senderId === receiverId) {
      throw new AppError(
        "Vous ne pouvez pas vous envoyer un message à vous-même",
        400,
      );
    }

    const msg = await messageRepository.send(senderId, receiverId, content);
    return {
      id: msg.id,
      content: msg.content,
      sent_at: msg.sentAt,
      sender: msg.sender,
      receiver: msg.receiver,
    };
  }
}
