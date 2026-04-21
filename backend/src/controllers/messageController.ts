import { AppError } from "../libs/AppError";
import MessageService from "../services/MessageService";
import { Controller } from "../libs/Controller";

const messageService = new MessageService();

export default class MessageController extends Controller {

  async listConversations() {
    try {
      const userId = this.request.userId!;
      const data   = await messageService.listConversations(userId);
      return this.response.status(200).json({ data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async getConversation() {
    try {
      const userId    = this.request.userId!;
      const partnerId = this.request.params.userId as string;
      const data      = await messageService.getConversation(userId, partnerId);
      return this.response.status(200).json({ data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async send() {
    try {
      const senderId   = this.request.userId!;
      const receiverId = this.request.params.userId as string;
      const { content } = this.request.body as { content: string };
      const data = await messageService.send(senderId, receiverId, content);
      return this.response.status(201).json({ message: "Message envoyé", data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 400;
      return this.response.status(status).json({ message: error.message });
    }
  }
}
