import { createTimeSeriesRequestSchema, idSchema, timeSeriesListQuerySchema } from "@dyn/contracts";
import { Hono } from "hono";

import type { AppEnv } from "../../shared/context.js";
import { parseWithSchema, validated } from "../../shared/http.js";
import type { TimeSeriesService } from "./service.js";

export function createTimeSeriesRoutes(service: TimeSeriesService) {
  return new Hono<AppEnv>()
    .post(
      "/api/v1/monitoring-points/:monitoringPointId/time-series",
      validated("json", createTimeSeriesRequestSchema),
      async (c) => {
        const monitoringPointId = parseWithSchema(idSchema, c.req.param("monitoringPointId"));
        const input = c.req.valid("json");
        const series = await service.create(monitoringPointId, input);
        return c.json(series, 201);
      }
    )
    .get("/api/v1/time-series", validated("query", timeSeriesListQuerySchema), async (c) => {
      const series = await service.list(c.req.valid("query"));
      return c.json(series);
    })
    .get("/api/v1/time-series/:seriesId/metrics", async (c) => {
      const id = parseWithSchema(idSchema, c.req.param("seriesId"));
      const metrics = await service.metrics(id);
      return c.json(metrics);
    })
    .get("/api/v1/time-series/:seriesId", async (c) => {
      const id = parseWithSchema(idSchema, c.req.param("seriesId"));
      const series = await service.get(id);
      return c.json(series);
    })
    .delete("/api/v1/time-series/:seriesId", async (c) => {
      const id = parseWithSchema(idSchema, c.req.param("seriesId"));
      await service.delete(id);
      return c.body(null, 204);
    });
}
