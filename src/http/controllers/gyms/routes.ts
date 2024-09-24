import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middlewares/verifyJWT";
import { searchController } from "./searchController";
import { nearbyController } from "./nearbyController";
import { createController } from "./createController";
import { verifyUserRole } from "@/http/middlewares/verifyUserRole";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT); // Todas as rotas autenticadas

  app.get('/gyms/search', searchController);
  app.get('/gyms/nearby', nearbyController);
  
  app.post('/gyms/create', { onRequest: [verifyUserRole({ role: 'ADMIN' })] }, createController);
}