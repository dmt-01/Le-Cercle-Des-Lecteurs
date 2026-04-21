import { AppError } from "../libs/AppError";
import EventService from "../services/EventService";
import { Controller } from "../libs/Controller";

const eventService = new EventService();

export default class EventController extends Controller {

  async list() {
    try {
      const data = await eventService.list();
      return this.response.status(200).json({ data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async getById() {
    try {
      const id   = this.request.params.id as string;
      const data = await eventService.getById(id);
      return this.response.status(200).json({ data });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      return this.response.status(status).json({ message: error.message });
    }
  }

  async create() {
    try {
      const userId = this.request.userId!;
      const data   = this.request.body as {
        title: string; description: string; eventDate: string; link?: string; groupId: string;
      };
      const result = await eventService.create(data, userId);
      return this.response.status(201).json({ message: "Événement créé", data: result });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 400;
      return this.response.status(status).json({ message: error.message });
    }
  }
}
