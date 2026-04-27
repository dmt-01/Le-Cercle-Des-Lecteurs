import GroupService from "../services/GroupService";
import { Controller } from "../libs/Controller";
import { AppError } from "../libs/AppError";

const groupService = new GroupService();

export default class GroupController extends Controller {
  async list() {
    try {
      const data = await groupService.list();
      return this.response.status(200).json({ data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async getById() {
    try {
      const id = this.request.params.id as string;
      const data = await groupService.getById(id);
      return this.response.status(200).json({ data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async create() {
    try {
      const userId = this.request.userId!;
      const { name, description, accessClub } = this.request.body as {
        name: string;
        description?: string;
        accessClub?: boolean;
      };
      const data = await groupService.create({
        name,
        description,
        accessClub,
        userId,
      });
      return this.response.status(201).json({ message: "Club créé", data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 400;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async join() {
    try {
      const userId = this.request.userId!;
      const groupId = this.request.params.id as string;
      await groupService.join(groupId, userId);
      return this.response
        .status(200)
        .json({ message: "Vous avez rejoint le club" });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 400;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async leave() {
    try {
      const userId = this.request.userId!;
      const groupId = this.request.params.id as string;
      await groupService.leave(groupId, userId);
      return this.response
        .status(200)
        .json({ message: "Vous avez quitté le club" });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async sendMessage() {
    try {
      const userId = this.request.userId!;
      const groupId = this.request.params.id as string;
      const { content } = this.request.body as { content: string };
      const data = await groupService.sendMessage(groupId, userId, content);
      return this.response
        .status(201)
        .json({ message: "Message envoyé", data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 400;
      return this.response.status(status).json({ message: error.message });
    }
  }
}
