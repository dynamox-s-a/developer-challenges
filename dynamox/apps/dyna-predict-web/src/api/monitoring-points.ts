import api from './client';
import type {
  CreateMonitoringPointRequest,
  CreateMonitoringPointResponse,
  MonitoringPointsQuery,
  PaginatedMonitoringPointsListResponse,
  PatchMonitoringPointRequest,
  PatchMonitoringPointResponse,
} from '@dynamox/types';

export type { CreateMonitoringPointRequest, MonitoringPointsQuery };

export const monitoringPointsAPI = {
  getMonitoringPoints: (params: MonitoringPointsQuery) =>
    api.get<PaginatedMonitoringPointsListResponse>('/monitoring-points', { params }),

  createMonitoringPoint: (data: CreateMonitoringPointRequest) =>
    api.post<CreateMonitoringPointResponse>('/monitoring-points', data),

  updateMonitoringPoint: (uuid: string, data: PatchMonitoringPointRequest) =>
    api.patch<PatchMonitoringPointResponse>(`/monitoring-points/${uuid}`, data),

  deleteMonitoringPoint: (uuid: string) => api.delete(`/monitoring-points/${uuid}`),
};
