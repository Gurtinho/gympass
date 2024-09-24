import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middlewares/verifyJWT";
import { createController } from "./createController";
import { validateController } from "./validateController";
import { historyController } from "./historyController";
import { metricsController } from "./metricsController";
import { verifyUserRole } from "@/http/middlewares/verifyUserRole";

export async function checkinsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT); // Todas as rotas autenticadas

  app.get('/checkins/history', historyController);
  app.get('/checkins/metrics', metricsController);

  app.post('/gyms/:gymId/checkins', createController);
  app.patch('/checkins/:checkinId/validate', { onRequest: [verifyUserRole({ role: 'ADMIN' })] }, validateController);
}