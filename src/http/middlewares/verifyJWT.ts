import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    reply.status(401).send({
      success: false,
      message: "Unauthorized."
    });
  }
}