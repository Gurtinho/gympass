import { makeFetchNearbyGymsService } from "@/services/factories/makeFetchNearbyGymsService";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export const nearbyController = async (request: FastifyRequest, reply: FastifyReply) => {
  const nearbyBodySchema = z.object({
    latitude: z.coerce.number().refine(value => {
      return Math.abs(value) <= 90 // Valor absoluto
    }),
    longitude: z.coerce.number().refine(value => {
      return Math.abs(value) <= 180 // Valor absoluto
    }),
  });

  const { latitude, longitude } = nearbyBodySchema.parse(request.body);

  const fetchNearbyGymsService = makeFetchNearbyGymsService();
  await fetchNearbyGymsService.execute({ userLatitude: latitude, userLongitude: longitude });

  return reply.status(201).send({ success: true });
}