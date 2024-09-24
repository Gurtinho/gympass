import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateService } from "../authenticateService";

export function makeAuthenticateService() {
  const userRepository = new PrismaUserRepository();
  const authenticateService = new AuthenticateService(userRepository);
  return authenticateService;
}