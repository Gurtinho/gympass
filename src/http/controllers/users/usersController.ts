import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { UserAlreadyExistsError } from "@/services/errors/userAlreadyExistsError";
import { makeRegisterService } from "@/services/factories/makeRegisterService";

export const userController = async (request: FastifyRequest, reply: FastifyReply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const registerService = makeRegisterService();
    await registerService.execute({ name, email, password });
  } catch(e) {
    if (e instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ success: false, message: e.message });
    }
    throw e;
  }

  return reply.status(201).send({ success: true });
}