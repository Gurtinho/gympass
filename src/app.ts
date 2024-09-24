import fastify from "fastify";
import { usersRoutes } from "./http/controllers/users/routes";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { ZodError } from "zod";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { checkinsRoutes } from "./http/controllers/checkins/routes";

export const app = fastify();

// Registra o uso do JWT
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false
  },
  sign: {
    expiresIn: '10m'
  }
});

app.register(fastifyCookie); // registro da lib de cookies

// Registra as rotas da aplicação
app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkinsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: Usar ferramenta externa Sentry/Datadog/NewRelic | Se possível com envio de email ou whatsapp
  }
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      issues: error.format(),
    });
  }
  return reply.status(500).send({
    message: "internal Server Error."
  });
});