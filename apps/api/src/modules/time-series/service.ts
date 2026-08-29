import type {
  CreateTimeSeriesRequest,
  TimeSeriesListQuery,
  TimeSeriesSummary,
} from "@dyn/contracts";
import type { TimeSeriesRow } from "@dyn/database";

import { DomainError, NotFoundError } from "../../shared/errors.js";
import type { TimeSeriesRepository, TimeSeriesSummaryRecord } from "./repository.js";

function toTimeSeriesSummary(
  row: TimeSeriesRow,
  sensorId: string,
  monitoringPointId: string
): TimeSeriesSummary {
  return {
    id: row.id,
    monitoringPointId,
    sensorId,
    label: row.label,
    sampleCount: row.sampleCount,
    startedAt: row.startedAt.toISOString(),
    endedAt: row.endedAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

function mapSummary(record: TimeSeriesSummaryRecord): TimeSeriesSummary {
  return toTimeSeriesSummary(record.series, record.sensorId, record.monitoringPointId);
}

function assertUniqueTimestamps(input: CreateTimeSeriesRequest): void {
  const timestamps = new Set<number>();

  for (const sample of input.samples) {
    const timestamp = new Date(sample.timestamp).getTime();
    if (timestamps.has(timestamp)) {
      throw new DomainError({
        code: "VALIDATION_ERROR",
        message: "Time-series samples must have unique timestamps",
        status: 400,
        issues: [{ path: "samples", message: "Duplicate timestamps are not allowed" }],
      });
    }
    timestamps.add(timestamp);
  }
}

export function createTimeSeriesService(repository: TimeSeriesRepository) {
  return {
    async create(monitoringPointId: string, input: CreateTimeSeriesRequest) {
      const context = await repository.findMonitoringPointContext(monitoringPointId);
      if (!context) {
        throw new NotFoundError("Monitoring point");
      }

      if (!context.sensor) {
        throw new DomainError({
          code: "SENSOR_REQUIRED",
          message: "A sensor must be associated before storing time-series data",
          status: 422,
        });
      }

      assertUniqueTimestamps(input);
      const series = await repository.createTimeSeries({
        sensorId: context.sensor.id,
        label: input.label ?? null,
        samples: input.samples,
      });
      return toTimeSeriesSummary(series, context.sensor.id, context.point.id);
    },

    async list(query: TimeSeriesListQuery) {
      const result = await repository.listTimeSeries(query);
      return {
        items: result.items.map(mapSummary),
        page: query.page,
        pageSize: query.pageSize,
        total: result.total,
        totalPages: Math.ceil(result.total / query.pageSize),
      };
    },

    async get(id: string) {
      const record = await repository.findTimeSeries(id);
      if (!record) {
        throw new NotFoundError("Time series");
      }

      const samples = await repository.listTimeSeriesSamples(id);
      return {
        ...mapSummary(record),
        samples,
      };
    },

    async metrics(id: string) {
      const metrics = await repository.calculateTimeSeriesMetrics(id);
      if (!metrics) {
        throw new NotFoundError("Time series");
      }

      return {
        seriesId: id,
        sampleCount: metrics.sampleCount,
        startedAt: metrics.startedAt.toISOString(),
        endedAt: metrics.endedAt.toISOString(),
        axes: {
          x: {
            min: metrics.xMin,
            max: metrics.xMax,
            mean: metrics.xMean,
            rms: metrics.xRms,
          },
          y: {
            min: metrics.yMin,
            max: metrics.yMax,
            mean: metrics.yMean,
            rms: metrics.yRms,
          },
          z: {
            min: metrics.zMin,
            max: metrics.zMax,
            mean: metrics.zMean,
            rms: metrics.zRms,
          },
        },
        vectorMagnitudeRms: metrics.vectorMagnitudeRms,
      };
    },

    async delete(id: string) {
      const deleted = await repository.deleteTimeSeries(id);
      if (!deleted) {
        throw new NotFoundError("Time series");
      }
    },
  };
}

export type TimeSeriesService = ReturnType<typeof createTimeSeriesService>;
