import type { RequestHandler } from "express";
import { TimeSeriesController } from "./time-series.controller";
import type { TimeSeriesRepository } from "./time-series.repository";
import { createTimeSeriesRouter } from "./time-series.routes";
import { TimeSeriesService } from "./time-series.service";

export function createTimeSeriesModule(
  repository: TimeSeriesRepository,
  authenticate: RequestHandler,
) {
  const service = new TimeSeriesService(repository);
  const controller = new TimeSeriesController(service);

  return { router: createTimeSeriesRouter(controller, authenticate) };
}
