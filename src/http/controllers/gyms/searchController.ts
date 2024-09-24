import { makeSearchGymsService } from "@/services/factories/makeSearchGymsService";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export const searchController = async (request: FastifyRequest, reply: FastifyReply) => {
  const searchBodySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1)
  });

  const { query, page } = searchBodySchema.parse(request.query);

  const searchGymsService = makeSearchGymsService();
  const gyms = await searchGymsService.execute({ query, page });

  return reply.status(200).send(gyms);
}