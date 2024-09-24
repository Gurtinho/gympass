import { PrismaCheckinsRepository } from "@/repositories/prisma/prisma-checkins-repository";
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { CheckinService } from "../chekinService";

export function makeCheckinService() {
  const checkinsRepository = new PrismaCheckinsRepository();
  const gymsRepository = new PrismaGymsRepository();
  const service = new CheckinService(checkinsRepository, gymsRepository);
  return service;
}