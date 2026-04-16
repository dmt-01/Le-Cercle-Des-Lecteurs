import { UserRepository } from "../repositories/userRepository";

const userRepository = new UserRepository();

export class UserService {

  async getUserByEmail(email: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    return user;
  }

  async createUser(data: {
    username: string;
    email: string;
    password_hash: string;
  }) {
    // Logique métier : vérifier si l'email existe déjà
    const existing = await userRepository.findByEmail(data.email);

    if (existing) {
      throw new Error("Email déjà utilisé");
    }

    return await userRepository.create(data);
  }

}