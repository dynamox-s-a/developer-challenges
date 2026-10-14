import { Router, type RequestHandler } from "express";
import type { MonitoringPointsController } from "./monitoring-points.controller";

export function createMonitoringPointsRouter(
  controller: MonitoringPointsController,
  authenticate: RequestHandler,
): Router {
  const router = Router();

  router.post(
    "/machines/:id/monitoring-points",
    authenticate,
    controller.createForMachine,
  );

  router.get("/monitoring-points", authenticate, controller.list);
  router.patch("/monitoring-points/:id", authenticate, controller.rename);
  router.delete("/monitoring-points/:id", authenticate, controller.remove);

  router.put(
    "/monitoring-points/:id/sensor",
    authenticate,
    controller.assignSensor,
  );
  router.delete(
    "/monitoring-points/:id/sensor",
    authenticate,
    controller.removeSensor,
  );

  return router;
}
