import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { makeCheckinService } from "@/services/factories/makeCheckinService";

export const createController = async (request: FastifyRequest, reply: FastifyReply) => {

  const createCheckinParamsSchema = z.object({
    gymId: z.string().uuid()
  });

  const createCheckinBodySchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
  });

  const { gymId } = createCheckinParamsSchema.parse(request.params);
  const { latitude, longitude } = createCheckinBodySchema.parse(request.body);

  const createCheckinService = makeCheckinService();
  await createCheckinService.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude
  });

  return reply.status(201).send({ success: true });
}