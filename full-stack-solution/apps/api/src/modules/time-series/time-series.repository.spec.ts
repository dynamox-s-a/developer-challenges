import type { PrismaClient } from "../../generated/prisma/client";
import { PrismaTimeSeriesRepository } from "./time-series.repository";

const asPrisma = (fake: unknown) => fake as PrismaClient;

const ts1 = new Date("2026-01-01T00:00:00.000Z");
const ts2 = new Date("2026-01-02T00:00:00.000Z");

describe("PrismaTimeSeriesRepository", () => {
  describe("insertReadings", () => {
    it("converts ISO timestamps to Dates, stores values and skips duplicates", async () => {
      const createManyAndReturn = jest.fn().mockResolvedValue([{}]);
      const repo = new PrismaTimeSeriesRepository(
        asPrisma({ reading: { createManyAndReturn } }),
      );

      const result = await repo.insertReadings("p1", {
        readings: [
          { timestamp: ts1.toISOString(), value: 1.5, metric: "temperature" as const },
          { timestamp: ts2.toISOString(), value: 2.5, metric: "temperature" as const },
        ],
      });

      expect(createManyAndReturn).toHaveBeenCalledWith({
        data: [
          { monitoringPointId: "p1", timestamp: ts1, value: 1.5, metric: "temperature" },
          { monitoringPointId: "p1", timestamp: ts2, value: 2.5, metric: "temperature" },
        ],
        skipDuplicates: true,
      });
      // 2 received, but the mock returned only 1 row
      expect(result).toEqual({ received: 2, inserted: 1 });
    });
  });

  describe("getReadings", () => {
    it("filters by date range and maps Dates to ISO strings", async () => {
      const findMany = jest
        .fn()
        .mockResolvedValue([{ timestamp: ts1, value: 1, metric: "temperature" }]);
      const repo = new PrismaTimeSeriesRepository(
        asPrisma({ reading: { findMany } }),
      );

      const result = await repo.getReadings("p1", {
        from: "2026-01-01T00:00:00.000Z",
        to: "2026-01-31T00:00:00.000Z",
      });

      expect(findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            monitoringPointId: "p1",
            timestamp: { gte: ts1, lte: new Date("2026-01-31T00:00:00.000Z") },
          },
          orderBy: { timestamp: "asc" },
        }),
      );
      expect(result).toEqual([
        { timestamp: ts1.toISOString(), value: 1, metric: "temperature" },
      ]);
    });

    it("omits the timestamp filter when neither bound is given", async () => {
      const findMany = jest.fn().mockResolvedValue([]);
      const repo = new PrismaTimeSeriesRepository(
        asPrisma({ reading: { findMany } }),
      );

      await repo.getReadings("p1", {});

      expect(findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { monitoringPointId: "p1" },
        }),
      );
    });
  });

  describe("getMetrics", () => {
    it("returns nulls when there are no readings", async () => {
      const aggregate = jest.fn().mockResolvedValue({
        _count: { timestamp: 0 },
        _min: { value: null, timestamp: null },
        _max: { value: null, timestamp: null },
        _avg: { value: null },
      });
      const repo = new PrismaTimeSeriesRepository(
        asPrisma({ reading: { aggregate } }),
      );

      const result = await repo.getMetrics("p1", { metric: "temperature" });

      expect(result).toEqual({
        metric: "temperature",
        count: 0,
        min: null,
        max: null,
        avg: null,
        firstTimestamp: null,
        lastTimestamp: null,
      });
    });

    it("maps aggregate results and converts timestamps to ISO strings", async () => {
      const aggregate = jest.fn().mockResolvedValue({
        _count: { timestamp: 2 },
        _min: { value: 1, timestamp: ts1 },
        _max: { value: 2, timestamp: ts2 },
        _avg: { value: 1.5 },
      });
      const repo = new PrismaTimeSeriesRepository(
        asPrisma({ reading: { aggregate } }),
      );

      const result = await repo.getMetrics("p1", { metric: "temperature" });

      expect(result).toEqual({
        metric: "temperature",
        count: 2,
        min: 1,
        max: 2,
        avg: 1.5,
        firstTimestamp: ts1.toISOString(),
        lastTimestamp: ts2.toISOString(),
      });
    });
  });

  describe("deleteReadings", () => {
    it("builds a range-filtered where clause and returns deleted count", async () => {
      const deleteMany = jest.fn().mockResolvedValue({ count: 7 });
      const repo = new PrismaTimeSeriesRepository(
        asPrisma({ reading: { deleteMany } }),
      );

      const result = await repo.deleteReadings("p1", {
        from: ts1.toISOString(),
      });

      expect(deleteMany).toHaveBeenCalledWith({
        where: {
          monitoringPointId: "p1",
          timestamp: { gte: ts1 },
        },
      });
      expect(result).toEqual({ deleted: 7 });
    });
  });
});
