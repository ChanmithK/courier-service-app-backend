import prisma from "../config/database.js";
import type { User } from "../types/index.js";

export class UserModel {
  async create(
    userData: Omit<User, "id" | "created_at" | "updated_at">
  ): Promise<User> {
    return await prisma.user.create({
      data: userData,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }
}
