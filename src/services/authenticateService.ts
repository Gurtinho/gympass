import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalidCredentialsError";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";

interface AuthenticateServiceRequest {
  email: string;
  password: string;
}

interface AuthenticateServiceResponse {
  user: User;
}

export class AuthenticateService {
  constructor(
    private usersRepository: UsersRepository
  ) {}

  async execute({ email, password }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new InvalidCredentialsError();
    const doesPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!doesPasswordMatch) throw new InvalidCredentialsError();
    return {
      user,
    };
  }
}