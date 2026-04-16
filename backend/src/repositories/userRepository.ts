import prisma from "../libs/prisma";

export class UserRepository {

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  async create(data: {
    username: string;
    email: string;
    password_hash: string;
  }) {
    return await prisma.user.create({ data });
  }
}