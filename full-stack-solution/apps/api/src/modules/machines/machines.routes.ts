import { Router, type RequestHandler } from "express";
import type { MachinesController } from "./machines.controller";

export function createMachinesRouter(
  controller: MachinesController,
  authenticate: RequestHandler,
): Router {
  const router = Router();

  router.use(authenticate);

  router.get("/", controller.list);
  router.post("/", controller.create);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.remove);

  return router;
}
