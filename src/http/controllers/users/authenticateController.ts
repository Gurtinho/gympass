import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { UserAlreadyExistsError } from "@/services/errors/userAlreadyExistsError";
import { makeAuthenticateService } from "@/services/factories/makeAuthenticateService";

export const authenticateController = async (request: FastifyRequest, reply: FastifyReply) => {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateService = makeAuthenticateService();
    // Pega o usuário
    const { user } = await authenticateService.execute({ email, password });

    // token original usado nas requests
    const token = await reply.jwtSign(
      {
        role: user.role
      },
      {
      sign: {
        sub: user.id
      }
    });

    // token usado para revalidar o token original e recriar
    const refreshToken = await reply.jwtSign(
      {
        role: user.role
      },
      {
      sign: {
        sub: user.id,
        expiresIn: '7d'
      }
    });

    return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true
    })
    .status(200).send({ success: true, token });

  } catch(e) {
    if (e instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ success: false, message: e.message });
    }
    throw e;
  }
}