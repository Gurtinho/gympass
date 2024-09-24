import { FastifyRequest, FastifyReply } from "fastify";

export const refreshController = async (request: FastifyRequest, reply: FastifyReply) => {

  await request.jwtVerify({ onlyCookie: true }); // valida q o usuario ta autenticado, somente olhando os cookies se existe o refrsh token

  const { role } = request.user;

  // token original usado nas requests
  const token = await reply.jwtSign(
    {
      role
    },
    {
    sign: {
      sub: request.user.sub
    }
  });

  // token usado para revalidar o token original e recriar
  const refreshToken = await reply.jwtSign(
    {
      role
    },
    {
    sign: {
      sub: request.user.sub,
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
}