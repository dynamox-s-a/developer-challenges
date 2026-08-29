import {
  attachSensorRequestSchema,
  createMonitoringPointRequestSchema,
  idSchema,
  monitoringPointListQuerySchema,
} from "@dyn/contracts";
import { Hono } from "hono";

import type { AppEnv } from "../../shared/context.js";
import { parseWithSchema, validated } from "../../shared/http.js";
import type { MonitoringPointService } from "./service.js";

export function createMonitoringPointRoutes(service: MonitoringPointService) {
  return new Hono<AppEnv>()
    .post(
      "/api/v1/machines/:machineId/monitoring-points",
      validated("json", createMonitoringPointRequestSchema),
      async (c) => {
        const machineId = parseWithSchema(idSchema, c.req.param("machineId"));
        const input = c.req.valid("json");
        const point = await service.create(machineId, input);
        return c.json(point, 201);
      }
    )
    .get("/api/v1/machines/:machineId/monitoring-points", async (c) => {
      const machineId = parseWithSchema(idSchema, c.req.param("machineId"));
      const points = await service.listForMachine(machineId);
      return c.json(points);
    })
    .get(
      "/api/v1/monitoring-points",
      validated("query", monitoringPointListQuerySchema),
      async (c) => {
        const points = await service.list(c.req.valid("query"));
        return c.json(points);
      }
    )
    .post(
      "/api/v1/monitoring-points/:monitoringPointId/sensor",
      validated("json", attachSensorRequestSchema),
      async (c) => {
        const monitoringPointId = parseWithSchema(idSchema, c.req.param("monitoringPointId"));
        const input = c.req.valid("json");
        const sensor = await service.attachSensor(monitoringPointId, input);
        return c.json(sensor, 201);
      }
    );
}
