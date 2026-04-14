import { TimeSeriesMetrics } from '../types/timeSeries';

type TimeSeriesPersistenceModel = {
  _id: { toString(): string };
  name?: string;
  samples: {
    timestamp: Date;
    value: number;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
};

export function toTimeSeriesResponse(timeSeries: TimeSeriesPersistenceModel) {
  return {
    id: timeSeries._id.toString(),
    name: timeSeries.name,
    samples: timeSeries.samples,
    createdAt: timeSeries.createdAt,
    updatedAt: timeSeries.updatedAt,
  };
}

export function toTimeSeriesCreationResponse(
  timeSeries: TimeSeriesPersistenceModel
) {
  return toTimeSeriesResponse(timeSeries);
}

export function toCountResponse(count: number) {
  return {
    count,
  };
}

export function toTimeSeriesMetricsResponse(metrics: TimeSeriesMetrics) {
  return {
    count: metrics.count,
    min: metrics.min,
    max: metrics.max,
    average: metrics.average,
    sum: metrics.sum,
    range: metrics.range,
    firstTimestamp: metrics.firstTimestamp,
    lastTimestamp: metrics.lastTimestamp,
  };
}