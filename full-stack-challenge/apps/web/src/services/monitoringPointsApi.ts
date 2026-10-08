import type {
  MonitoringPointDto,
  MonitoringPointInput,
  MonitoringPointListItemDto,
  MonitoringPointSortField,
  Paginated,
  SortDirection,
} from '@dynapredict/shared-types';
import { apiClient } from './apiClient';

export interface MonitoringPointsQuery {
  page: number;
  pageSize: number;
  sortBy: MonitoringPointSortField;
  sortDir: SortDirection;
}

/** Every point across all machines, one server-sorted page at a time. */
export async function listMonitoringPoints(
  query: MonitoringPointsQuery,
): Promise<Paginated<MonitoringPointListItemDto>> {
  const { data } = await apiClient.get<Paginated<MonitoringPointListItemDto>>(
    '/monitoring-points',
    { params: query },
  );
  return data;
}

/** One point with its machine and sensor. */
export async function getMonitoringPoint(
  id: string,
): Promise<MonitoringPointListItemDto> {
  const { data } = await apiClient.get<MonitoringPointListItemDto>(
    `/monitoring-points/${id}`,
  );
  return data;
}

export async function createMonitoringPoint(
  machineId: string,
  input: MonitoringPointInput,
): Promise<MonitoringPointDto> {
  const { data } = await apiClient.post<MonitoringPointDto>(
    `/machines/${machineId}/monitoring-points`,
    input,
  );
  return data;
}

export async function renameMonitoringPoint(
  id: string,
  input: MonitoringPointInput,
): Promise<MonitoringPointDto> {
  const { data } = await apiClient.put<MonitoringPointDto>(
    `/monitoring-points/${id}`,
    input,
  );
  return data;
}

/** Hard delete; the database cascades to the sensor and its readings. */
export async function deleteMonitoringPoint(id: string): Promise<void> {
  await apiClient.delete(`/monitoring-points/${id}`);
}
