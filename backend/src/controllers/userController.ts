import type { Request, Response } from "express";
import { UserService } from "../services/userService";

const userService = new UserService();

export class UserController {

  async getByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const user = await userService.getUserByEmail(email as string);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { username, email, password_hash } = req.body;
      const user = await userService.createUser({ username, email, password_hash });
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

}