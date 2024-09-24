import { makeFetchUserCheckinsHistoryService } from "@/services/factories/makeFetchUserCheckinsHistoryService";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export const historyController = async (request: FastifyRequest, reply: FastifyReply) => {
  const historyQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1)
  });

  const { page } = historyQuerySchema.parse(request.query);

  const fetchUserCheckinsHistoryService = makeFetchUserCheckinsHistoryService();
  await fetchUserCheckinsHistoryService.execute({
    userId: request.user.sub,
    page
  });

  return reply.status(201).send({ success: true });
}