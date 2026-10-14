import { NotFoundError } from "../../shared/errors/app-error";
import type { TimeSeriesRepository } from "./time-series.repository";
import { TimeSeriesService } from "./time-series.service";

const input = {
  readings: [
    { timestamp: "2026-01-01T00:00:00.000Z", value: 1, metric: "temperature" as const },
  ],
};
const range = {};
const metricsQuery = { metric: "temperature" as const };

describe("TimeSeriesService", () => {
  let repository: jest.Mocked<TimeSeriesRepository>;
  let service: TimeSeriesService;

  beforeEach(() => {
    repository = {
      pointBelongsToUser: jest.fn(),
      insertReadings: jest.fn(),
      getReadings: jest.fn(),
      getMetrics: jest.fn(),
      countByUser: jest.fn(),
      deleteReadings: jest.fn(),
    };
    service = new TimeSeriesService(repository);
  });

  const ownership = (owns: boolean) =>
    repository.pointBelongsToUser.mockResolvedValue(owns);

  describe("insert", () => {
    it("throws NotFound when the point is not the user's", async () => {
      ownership(false);
      await expect(service.insert("p1", "u1", input)).rejects.toThrow(
        NotFoundError,
      );
      expect(repository.insertReadings).not.toHaveBeenCalled();
    });

    it("delegates to the repository when the point belongs to the user", async () => {
      ownership(true);
      repository.insertReadings.mockResolvedValue({ received: 1, inserted: 1 });

      const result = await service.insert("p1", "u1", input);

      expect(result).toEqual({ received: 1, inserted: 1 });
      expect(repository.insertReadings).toHaveBeenCalledWith("p1", input);
    });
  });

  describe("getReadings", () => {
    it("throws NotFound when the point is not the user's", async () => {
      ownership(false);
      await expect(service.getReadings("p1", "u1", range)).rejects.toThrow(
        NotFoundError,
      );
    });

    it("returns the readings", async () => {
      ownership(true);
      const readings = [
        { timestamp: "2026-01-01T00:00:00.000Z", value: 1, metric: "temperature" as const },
      ];
      repository.getReadings.mockResolvedValue(readings);

      const result = await service.getReadings("p1", "u1", range);

      expect(result).toBe(readings);
      expect(repository.getReadings).toHaveBeenCalledWith("p1", range);
    });
  });

  describe("getMetrics", () => {
    it("throws NotFound when the point is not the user's", async () => {
      ownership(false);
      await expect(service.getMetrics("p1", "u1", metricsQuery)).rejects.toThrow(
        NotFoundError,
      );
    });

    it("returns the metrics", async () => {
      ownership(true);
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

      const result = await service.getMetrics("p1", "u1", metricsQuery);

      expect(result).toBe(metrics);
    });
  });

  describe("countByUser", () => {
    it("delegates without checking ownership (cross-point aggregate)", async () => {
      repository.countByUser.mockResolvedValue({ count: 42 });
      const result = await service.countByUser("u1");

      expect(result).toEqual({ count: 42 });
      expect(repository.pointBelongsToUser).not.toHaveBeenCalled();
    });
  });

  describe("deleteReadings", () => {
    it("throws NotFound when the point is not the user's", async () => {
      ownership(false);
      await expect(service.deleteReadings("p1", "u1", range)).rejects.toThrow(
        NotFoundError,
      );
      expect(repository.deleteReadings).not.toHaveBeenCalled();
    });

    it("delegates to the repository and returns how many were deleted", async () => {
      ownership(true);
      repository.deleteReadings.mockResolvedValue({ deleted: 3 });

      const result = await service.deleteReadings("p1", "u1", range);

      expect(result).toEqual({ deleted: 3 });
      expect(repository.deleteReadings).toHaveBeenCalledWith("p1", range);
    });
  });
});
