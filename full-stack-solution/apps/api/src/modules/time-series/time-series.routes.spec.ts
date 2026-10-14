import { Router, type Express } from "express";
import { MAX_READINGS_PER_BATCH } from "@full-stack-solution/shared";
import request from "supertest";
import { createApp } from "../../app";
import { createAuthMiddleware } from "../auth/auth.middleware";
import { TokenService } from "../auth/token.service";
import { createTimeSeriesModule } from "./time-series.module";
import type { TimeSeriesRepository } from "./time-series.repository";

describe("time-series routes", () => {
  const tokenService = new TokenService("s".repeat(32), "1h");
  const auth = `Bearer ${tokenService.sign("u1")}`;
  let repository: jest.Mocked<TimeSeriesRepository>;
  let app: Express;

  beforeEach(() => {
    repository = {
      pointBelongsToUser: jest.fn(),
      insertReadings: jest.fn(),
      getReadings: jest.fn(),
      getMetrics: jest.fn(),
      countByUser: jest.fn(),
      deleteReadings: jest.fn(),
    };
    const module = createTimeSeriesModule(
      repository,
      createAuthMiddleware(tokenService),
    );
    app = createApp({ auth: Router(), timeSeries: module.router });
  });

  it.each([
    ["post", "/api/monitoring-points/p1/readings"],
    ["get", "/api/monitoring-points/p1/readings"],
    ["get", "/api/monitoring-points/p1/readings/metrics"],
    ["get", "/api/readings/count"],
    ["delete", "/api/monitoring-points/p1/readings"],
  ] as const)("%s %s requires authentication", async (method, path) => {
    expect((await request(app)[method](path)).status).toBe(401);
  });

  describe("POST /api/monitoring-points/:id/readings", () => {
    const post = (body: object) =>
      request(app)
        .post("/api/monitoring-points/p1/readings")
        .set("Authorization", auth)
        .send(body);

    it("accepts a batch at the documented maximum size", async () => {
      // MAX_READINGS_PER_BATCH readings serialize past the default body limit,
      // so this is what proves the advertised maximum is actually reachable.
      repository.pointBelongsToUser.mockResolvedValue(true);
      repository.insertReadings.mockResolvedValue({
        received: MAX_READINGS_PER_BATCH,
        inserted: MAX_READINGS_PER_BATCH,
      });

      const start = Date.UTC(2026, 0, 1);
      const response = await post({
        readings: Array.from({ length: MAX_READINGS_PER_BATCH }, (_u, i) => ({
          timestamp: new Date(start + i * 60_000).toISOString(),
          value: -1234.567891,
          metric: "temperature" as const,
        })),
      });

      expect(response.status).toBe(201);
      expect(response.body.received).toBe(MAX_READINGS_PER_BATCH);
    });

    it("inserts a batch and returns received/inserted counts", async () => {
      repository.pointBelongsToUser.mockResolvedValue(true);
      repository.insertReadings.mockResolvedValue({ received: 2, inserted: 1 });

      const response = await post({
        readings: [
          { timestamp: "2026-01-01T00:00:00.000Z", value: 1, metric: "temperature" },
          { timestamp: "2026-01-02T00:00:00.000Z", value: 2, metric: "temperature" },
        ],
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ received: 2, inserted: 1 });
      expect(repository.insertReadings).toHaveBeenCalledWith("p1", {
        readings: [
          { timestamp: "2026-01-01T00:00:00.000Z", value: 1, metric: "temperature" },
          { timestamp: "2026-01-02T00:00:00.000Z", value: 2, metric: "temperature" },
        ],
      });
    });

    it("returns 404 when the point is not the user's", async () => {
      repository.pointBelongsToUser.mockResolvedValue(false);
      const response = await post({
        readings: [{ timestamp: "2026-01-01T00:00:00.000Z", value: 1, metric: "temperature" }],
      });

      expect(response.status).toBe(404);
    });

    it("returns 400 for an empty batch", async () => {
      expect((await post({ readings: [] })).status).toBe(400);
    });

    it("returns 400 for a timestamp without time zone", async () => {
      const response = await post({
        readings: [{ timestamp: "2026-01-01T00:00:00", value: 1, metric: "temperature" }],
      });
      expect(response.status).toBe(400);
    });

    it("returns 400 for a non-numeric value", async () => {
      const response = await post({
        readings: [{ timestamp: "2026-01-01T00:00:00.000Z", value: "high", metric: "temperature" }],
      });
      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/monitoring-points/:id/readings", () => {
    const get = (qs = "") =>
      request(app)
        .get(`/api/monitoring-points/p1/readings${qs}`)
        .set("Authorization", auth);

    it("returns the readings ordered by timestamp", async () => {
      repository.pointBelongsToUser.mockResolvedValue(true);
      const readings = [
        { timestamp: "2026-01-01T00:00:00.000Z", value: 1, metric: "temperature" as const },
      ];
      repository.getReadings.mockResolvedValue(readings);

      const response = await get();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(readings);
      expect(repository.getReadings).toHaveBeenCalledWith("p1", {});
    });

    it("passes from/to bounds to the repository", async () => {
      repository.pointBelongsToUser.mockResolvedValue(true);
      repository.getReadings.mockResolvedValue([]);

      await get(
        "?from=2026-01-01T00:00:00.000Z&to=2026-01-31T00:00:00.000Z",
      );

      expect(repository.getReadings).toHaveBeenCalledWith("p1", {
        from: "2026-01-01T00:00:00.000Z",
        to: "2026-01-31T00:00:00.000Z",
      });
    });

    it("returns 400 when from is after to", async () => {
      const response = await get(
        "?from=2026-02-01T00:00:00.000Z&to=2026-01-01T00:00:00.000Z",
      );
      expect(response.status).toBe(400);
    });

    it("returns 404 when the point is not the user's", async () => {
      repository.pointBelongsToUser.mockResolvedValue(false);
      expect((await get()).status).toBe(404);
    });
  });

  describe("GET /api/monitoring-points/:id/readings/metrics", () => {
    it("returns metrics for the monitoring point", async () => {
      repository.pointBelongsToUser.mockResolvedValue(true);
      const metrics = {
        metric: "temperature" as const,
        count: 2,
        min: 1,
        max: 2,
        avg: 1.5,
        firstTimestamp: "2026-01-01T00:00:00.000Z",
        lastTimestamp: "2026-01-02T00:00:00.000Z",
      };
      repository.getMetrics.mockResolvedValue(metrics);

      const response = await request(app)
        .get("/api/monitoring-points/p1/readings/metrics?metric=temperature")
        .set("Authorization", auth);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(metrics);
      expect(repository.getMetrics).toHaveBeenCalledWith("p1", {
        metric: "temperature",
      });
    });

    it("refuses to aggregate without a metric", async () => {
      // Averaging a temperature together with a vibration amplitude would
      // produce a number that describes nothing, so the quantity is required.
      repository.pointBelongsToUser.mockResolvedValue(true);

      const response = await request(app)
        .get("/api/monitoring-points/p1/readings/metrics")
        .set("Authorization", auth);

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
      expect(repository.getMetrics).not.toHaveBeenCalled();
    });

    it("refuses an unknown metric", async () => {
      repository.pointBelongsToUser.mockResolvedValue(true);

      const response = await request(app)
        .get("/api/monitoring-points/p1/readings/metrics?metric=pressure")
        .set("Authorization", auth);

      expect(response.status).toBe(400);
      expect(repository.getMetrics).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/readings/count", () => {
    it("returns the total reading count across all the user's points", async () => {
      repository.countByUser.mockResolvedValue({ count: 42 });

      const response = await request(app)
        .get("/api/readings/count")
        .set("Authorization", auth);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ count: 42 });
      expect(repository.countByUser).toHaveBeenCalledWith("u1");
    });
  });

  describe("DELETE /api/monitoring-points/:id/readings", () => {
    const del = (qs = "") =>
      request(app)
        .delete(`/api/monitoring-points/p1/readings${qs}`)
        .set("Authorization", auth);

    it("deletes all readings and returns the count", async () => {
      repository.pointBelongsToUser.mockResolvedValue(true);
      repository.deleteReadings.mockResolvedValue({ deleted: 5 });

      const response = await del();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ deleted: 5 });
      expect(repository.deleteReadings).toHaveBeenCalledWith("p1", {});
    });

    it("deletes a bounded range", async () => {
      repository.pointBelongsToUser.mockResolvedValue(true);
      repository.deleteReadings.mockResolvedValue({ deleted: 2 });

      await del("?from=2026-01-01T00:00:00.000Z");

      expect(repository.deleteReadings).toHaveBeenCalledWith("p1", {
        from: "2026-01-01T00:00:00.000Z",
      });
    });

    it("returns 404 when the point is not the user's", async () => {
      repository.pointBelongsToUser.mockResolvedValue(false);
      expect((await del()).status).toBe(404);
    });
  });
});
