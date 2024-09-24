import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';

interface Roles {
  role: 'ADMIN' | 'MEMBER'
}

export function verifyUserRole({ role: roleToVerify }: Roles) {
  // retorna um middleware do fastify
  return async (request: FastifyRequest, reply: FastifyReply) => {

    const { role } = request.user;

    if (role !== roleToVerify) {
      reply.status(401).send({
        success: false,
        message: "Unauthorized."
      });
    }
    
  }
}