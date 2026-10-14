import { Router, type RequestHandler } from "express";
import type { TimeSeriesController } from "./time-series.controller";

export function createTimeSeriesRouter(
  controller: TimeSeriesController,
  authenticate: RequestHandler,
): Router {
  const router = Router();

  router.post(
    "/monitoring-points/:id/readings",
    authenticate,
    controller.insert,
  );

  router.get(
    "/monitoring-points/:id/readings",
    authenticate,
    controller.getReadings,
  );

  router.get(
    "/monitoring-points/:id/readings/metrics",
    authenticate,
    controller.getMetrics,
  );

  router.get("/readings/count", authenticate, controller.countByUser);

  router.delete(
    "/monitoring-points/:id/readings",
    authenticate,
    controller.deleteReadings,
  );

  return router;
}
