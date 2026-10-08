import type {
  CreateReadingsResultDto,
  DeleteReadingsResultDto,
  PredictionDto,
  PredictionMethod,
  ReadingInput,
  ReadingsCountDto,
  ReadingsMetricsDto,
  ReadingsPageDto,
} from '@dynapredict/shared-types';
import { apiClient } from './apiClient';

/** Both bounds inclusive, ISO 8601 with offset; either may be omitted. */
export interface TimeRange {
  from?: string;
  to?: string;
}

export interface ReadingsPageQuery extends TimeRange {
  limit?: number;
  /** The previous page's `meta.nextCursor` (exclusive). */
  after?: string;
}

export interface PredictionQuery {
  method: PredictionMethod;
  window: number;
  horizon: number;
}

const base = (sensorId: string) => `/sensors/${sensorId}/readings`;

/** Stores up to MAX_READINGS_PER_REQUEST readings; duplicates are skipped. */
export async function createReadings(
  sensorId: string,
  readings: ReadingInput[],
): Promise<CreateReadingsResultDto> {
  const { data } = await apiClient.post<CreateReadingsResultDto>(
    base(sensorId),
    { readings },
  );
  return data;
}

/** One page of the series, oldest first. */
export async function listReadings(
  sensorId: string,
  query: ReadingsPageQuery = {},
): Promise<ReadingsPageDto> {
  const { data } = await apiClient.get<ReadingsPageDto>(base(sensorId), {
    params: query,
  });
  return data;
}

/** How many readings a sensor has stored, optionally within a range. */
export async function countReadings(
  sensorId: string,
  range: TimeRange = {},
): Promise<number> {
  const { data } = await apiClient.get<ReadingsCountDto>(
    `${base(sensorId)}/count`,
    { params: range },
  );
  return data.count;
}

export async function getReadingsMetrics(
  sensorId: string,
  range: TimeRange = {},
): Promise<ReadingsMetricsDto> {
  const { data } = await apiClient.get<ReadingsMetricsDto>(
    `${base(sensorId)}/metrics`,
    { params: range },
  );
  return data;
}

/** Hard delete of the whole series, or of an inclusive range of it. */
export async function deleteReadings(
  sensorId: string,
  range: TimeRange = {},
): Promise<number> {
  const { data } = await apiClient.delete<DeleteReadingsResultDto>(
    base(sensorId),
    { params: range },
  );
  return data.deleted;
}

/** Fails with 422 when the sensor has fewer than 2 readings. */
export async function getPrediction(
  sensorId: string,
  query: PredictionQuery,
): Promise<PredictionDto> {
  const { data } = await apiClient.get<PredictionDto>(
    `${base(sensorId)}/prediction`,
    { params: query },
  );
  return data;
}
