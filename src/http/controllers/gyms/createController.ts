import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { makeCreateGymService } from "@/services/factories/makeCreateGymService";

export const createController = async (request: FastifyRequest, reply: FastifyReply) => {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine(value => {
      return Math.abs(value) <= 90 // Valor absoluto
    }),
    longitude: z.number().refine(value => {
      return Math.abs(value) <= 180 // Valor absoluto
    }),
  });

  const { title, description, phone, latitude, longitude } = createGymBodySchema.parse(request.body);

  const createGymService = makeCreateGymService();
  await createGymService.execute({ title, description, phone, latitude, longitude });

  return reply.status(201).send({ success: true });
}