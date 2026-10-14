import type { RequestHandler } from "express";
import { MonitoringPointsController } from "./monitoring-points.controller";
import type { MonitoringPointsRepository } from "./monitoring-points.repository";
import { createMonitoringPointsRouter } from "./monitoring-points.routes";
import { MonitoringPointsService } from "./monitoring-points.service";

export function createMonitoringPointsModule(
  repository: MonitoringPointsRepository,
  authenticate: RequestHandler,
) {
  const service = new MonitoringPointsService(repository);
  const controller = new MonitoringPointsController(service);

  return { router: createMonitoringPointsRouter(controller, authenticate) };
}
