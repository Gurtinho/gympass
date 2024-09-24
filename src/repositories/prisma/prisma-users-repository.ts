import { prisma } from "@/lib/prisma";
import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";

export class PrismaUserRepository implements UsersRepository {
  async create({ name, email, password_hash }: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({ 
      data: {  
        name, 
        email, 
        password_hash
      },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });
    return user;
  }

  async findById(userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    return user;
  }
}