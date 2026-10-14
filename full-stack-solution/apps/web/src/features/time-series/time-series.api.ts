import type {
  CreateReadingsInput,
  DeleteReadingsResult,
  InsertReadingsResult,
  Reading,
  ReadingsMetrics,
  ReadingsMetricsQuery,
  ReadingsRangeQuery,
  TimeSeriesCount,
} from "@full-stack-solution/shared";
import { request } from "@web/api/http-client";

/** `POST /api/monitoring-points/:id/readings` — up to 5 000 readings. */
export function ingestReadings(
  token: string,
  monitoringPointId: string,
  input: CreateReadingsInput,
): Promise<InsertReadingsResult> {
  return request<InsertReadingsResult>(
    `/api/monitoring-points/${monitoringPointId}/readings`,
    { method: "POST", body: input, token },
  );
}

/** `GET /api/monitoring-points/:id/readings` — inclusive `from`/`to` bounds. */
export function listReadings(
  token: string,
  monitoringPointId: string,
  range: ReadingsRangeQuery = {},
): Promise<Reading[]> {
  return request<Reading[]>(
    `/api/monitoring-points/${monitoringPointId}/readings`,
    { token, query: { ...range } },
  );
}

/**
 * `GET /api/monitoring-points/:id/readings/metrics`
 *
 * `metric` is required: the API refuses to aggregate across quantities.
 */
export function getMetrics(
  token: string,
  monitoringPointId: string,
  query: ReadingsMetricsQuery,
): Promise<ReadingsMetrics> {
  return request<ReadingsMetrics>(
    `/api/monitoring-points/${monitoringPointId}/readings/metrics`,
    { token, query: { ...query } },
  );
}

/** `GET /api/readings/count` — total readings stored by the user. */
export function getStoredCount(token: string): Promise<TimeSeriesCount> {
  return request<TimeSeriesCount>("/api/readings/count", { token });
}

/** `DELETE /api/monitoring-points/:id/readings` — optional range. */
export function deleteReadings(
  token: string,
  monitoringPointId: string,
  range: ReadingsRangeQuery = {},
): Promise<DeleteReadingsResult> {
  return request<DeleteReadingsResult>(
    `/api/monitoring-points/${monitoringPointId}/readings`,
    { method: "DELETE", token, query: { ...range } },
  );
}
