import { Prisma, User } from "@prisma/client";
import { v4 as uuid } from "uuid";

import { UsersRepository } from "./users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = [];

  async create({ name, email, password_hash }: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: uuid(),
      name,
      email,
      password_hash,
      created_at: new Date()
    };
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(user => user.email === email);
    if (!user) return null;
    return user;
  }

  async findById(userId: string): Promise<User | null> {
    const user = this.users.find(user => user.id === userId);
    if (!user) return null;
    return user;
  }
  
}