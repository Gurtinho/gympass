import { PrismaCheckinsRepository } from "@/repositories/prisma/prisma-checkins-repository";
import { ValidateCheckinService } from "../validateCheckinService";

export function makeValidateCheckinService() {
  const checkinsRepository = new PrismaCheckinsRepository();
  const service = new ValidateCheckinService(checkinsRepository);
  return service;
}