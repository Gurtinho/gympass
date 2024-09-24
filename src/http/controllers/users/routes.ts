import { FastifyInstance } from "fastify";

import { userController } from "./usersController";
import { authenticateController } from "./authenticateController";
import { profileController } from "./profileController";
import { verifyJWT } from "@/http/middlewares/verifyJWT";
import { refreshController } from "./refreshController";

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', userController);
  app.post('/sessions', authenticateController);

  // Rota apenas para pegar o refresh token da aplicação
  app.patch('/token/refresh', refreshController);

  // Authenticated
  app.get('/me', { onRequest: [verifyJWT] }, profileController);
}