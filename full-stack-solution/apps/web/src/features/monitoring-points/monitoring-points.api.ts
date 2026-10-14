import type {
  AssignSensorInput,
  CreateMonitoringPointInput,
  ListMonitoringPointsQuery,
  MonitoringPoint,
  Paginated,
  Sensor,
  UpdateMonitoringPointInput,
} from "@full-stack-solution/shared";
import { request } from "@web/api/http-client";

/** `GET /api/monitoring-points` — server-side pagination and sorting. */
export function listMonitoringPoints(
  token: string,
  query: ListMonitoringPointsQuery,
): Promise<Paginated<MonitoringPoint>> {
  return request<Paginated<MonitoringPoint>>("/api/monitoring-points", {
    token,
    query: { ...query },
  });
}

/** `POST /api/machines/:machineId/monitoring-points` */
export function createMonitoringPoint(
  token: string,
  machineId: string,
  input: CreateMonitoringPointInput,
): Promise<MonitoringPoint> {
  return request<MonitoringPoint>(
    `/api/machines/${machineId}/monitoring-points`,
    { method: "POST", body: input, token },
  );
}

/** `PATCH /api/monitoring-points/:id` */
export function updateMonitoringPoint(
  token: string,
  id: string,
  input: UpdateMonitoringPointInput,
): Promise<MonitoringPoint> {
  return request<MonitoringPoint>(`/api/monitoring-points/${id}`, {
    method: "PATCH",
    body: input,
    token,
  });
}

/** `DELETE /api/monitoring-points/:id` */
export function deleteMonitoringPoint(
  token: string,
  id: string,
): Promise<void> {
  return request<void>(`/api/monitoring-points/${id}`, {
    method: "DELETE",
    token,
  });
}

/**
 * `PUT /api/monitoring-points/:id/sensor`.
 *
 * Replaces the current sensor. The API rejects TcAg/TcAs on Pump machines with
 * HTTP 422 before touching any data.
 */
export function assignSensor(
  token: string,
  monitoringPointId: string,
  input: AssignSensorInput,
): Promise<Sensor> {
  return request<Sensor>(`/api/monitoring-points/${monitoringPointId}/sensor`, {
    method: "PUT",
    body: input,
    token,
  });
}

/** `DELETE /api/monitoring-points/:id/sensor` */
export function removeSensor(
  token: string,
  monitoringPointId: string,
): Promise<void> {
  return request<void>(`/api/monitoring-points/${monitoringPointId}/sensor`, {
    method: "DELETE",
    token,
  });
}
