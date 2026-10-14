import { Router, type RequestHandler } from "express";
import type { AuthController } from "./auth.controller";

export function createAuthRouter(
  controller: AuthController,
  authenticate: RequestHandler,
): Router {
  const router = Router();

  router.post("/login", controller.login);
  router.post("/logout", authenticate, controller.logout);
  router.get("/me", authenticate, controller.me);

  return router;
}
