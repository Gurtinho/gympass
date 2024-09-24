import { PrismaCheckinsRepository } from "@/repositories/prisma/prisma-checkins-repository";
import { GetUserMetricsService } from "../getUserMetricsService";

export function makeGetUserMetricsService() {
  const checkinsRepository = new PrismaCheckinsRepository();
  const service = new GetUserMetricsService(checkinsRepository);
  return service;
}