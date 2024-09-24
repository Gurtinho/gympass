import bcrypt from "bcryptjs";
import { UsersRepository } from "@/repositories/users-repository";
import { UserAlreadyExistsError } from "./errors/userAlreadyExistsError";
import { User } from "@prisma/client";

export interface RegisterInterface {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserResponse {
  user: User;
}

export class RegisterService {
  constructor(private userRepository: UsersRepository) {}
  
  async execute({ name, email, password }: RegisterInterface): Promise<RegisterUserResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) throw new UserAlreadyExistsError();

    const password_hash = await bcrypt.hash(password, 8);

    const user = await this.userRepository.create({ name, email, password_hash });

    return {
      user
    };
  }
}