import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { makeValidateCheckinService } from "@/services/factories/makeValidateCheckinService";

export const validateController = async (request: FastifyRequest, reply: FastifyReply) => {

  const validateCheckinParamsSchema = z.object({
    checkinId: z.string().uuid()
  });

  const { checkinId } = validateCheckinParamsSchema.parse(request.params);

  const validateCheckinService = makeValidateCheckinService();
  await validateCheckinService.execute({
    checkinId,
  });

  return reply.status(204).send({ success: true });
}