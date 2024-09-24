import { PrismaCheckinsRepository } from "@/repositories/prisma/prisma-checkins-repository";
import { FetchUserCheckinService } from "../fetchUserCheckinsHistoryService";

export function makeFetchUserCheckinsHistoryService() {
  const checkinsRepository = new PrismaCheckinsRepository();
  const service = new FetchUserCheckinService(checkinsRepository);
  return service;
}