import { makeGetUserMetricsService } from "@/services/factories/makeGetUserMetricsService";
import { FastifyRequest, FastifyReply } from "fastify";

export const metricsController = async (request: FastifyRequest, reply: FastifyReply) => {
  const getUserMetricsService = makeGetUserMetricsService();
  const checkinCount = await getUserMetricsService.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send(checkinCount);
}