import { makeGetUserProfileService } from "@/services/factories/makeGetUserProfileService";
import { FastifyRequest, FastifyReply } from "fastify";

export const profileController = async (request: FastifyRequest, reply: FastifyReply) => {
  const getUserProfile = makeGetUserProfileService();

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({ 
    success: true,
    user: {
      ...user,
      password_hash: undefined
    }
  });
}