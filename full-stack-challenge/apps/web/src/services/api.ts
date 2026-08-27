import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AssociateSensorRequest,
  CreateMachineRequest,
  CreateMonitoringPointRequest,
  CreateSensorReadingsRequest,
  DeleteReadingsResponse,
  ListMonitoringPointsParams,
  MachineDto,
  MonitoringPointDto,
  PaginatedResponse,
  ReadingsCountResponse,
  SensorMetricsDto,
  SensorReadingDto,
  TimeSeriesForecastDto,
  TimeSeriesRangeParams,
  UpdateMachineRequest,
} from '@dynamox/shared';
import { apiRequest } from './apiClient';

export const authApi = {
  login: (payload: AuthLoginRequest) =>
    apiRequest<AuthLoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  logout: () =>
    apiRequest<void>('/api/auth/logout', {
      method: 'POST',
    }),
  me: () => apiRequest<{ user: AuthLoginResponse['user'] }>('/api/auth/me'),
};

export const machinesApi = {
  list: () => apiRequest<MachineDto[]>('/api/machines'),
  create: (payload: CreateMachineRequest) =>
    apiRequest<MachineDto>('/api/machines', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: UpdateMachineRequest) =>
    apiRequest<MachineDto>(`/api/machines/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  remove: (id: string) =>
    apiRequest<void>(`/api/machines/${id}`, {
      method: 'DELETE',
    }),
};

function toQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const monitoringPointsApi = {
  list: (params: ListMonitoringPointsParams = {}) =>
    apiRequest<PaginatedResponse<MonitoringPointDto>>(
      `/api/monitoring-points${toQuery({
        page: params.page,
        limit: params.limit,
        sortBy: params.sortBy,
        order: params.order,
      })}`
    ),
  get: (id: string) => apiRequest<MonitoringPointDto>(`/api/monitoring-points/${id}`),
  create: (machineId: string, payload: CreateMonitoringPointRequest) =>
    apiRequest<MonitoringPointDto>(`/api/machines/${machineId}/monitoring-points`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  remove: (id: string) =>
    apiRequest<void>(`/api/monitoring-points/${id}`, {
      method: 'DELETE',
    }),
  associateSensor: (pointId: string, payload: AssociateSensorRequest) =>
    apiRequest<MonitoringPointDto>(`/api/monitoring-points/${pointId}/sensor`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  removeSensor: (pointId: string) =>
    apiRequest<void>(`/api/monitoring-points/${pointId}/sensor`, {
      method: 'DELETE',
    }),
};

export const timeSeriesApi = {
  store: (pointId: string, payload: CreateSensorReadingsRequest) =>
    apiRequest<{ insertedCount: number }>(`/api/monitoring-points/${pointId}/readings`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  list: (pointId: string, range: TimeSeriesRangeParams = {}) =>
    apiRequest<SensorReadingDto[]>(
      `/api/monitoring-points/${pointId}/readings${toQuery(range)}`
    ),
  metrics: (pointId: string, range: TimeSeriesRangeParams = {}) =>
    apiRequest<SensorMetricsDto>(
      `/api/monitoring-points/${pointId}/readings/metrics${toQuery(range)}`
    ),
  count: (pointId: string, range: TimeSeriesRangeParams = {}) =>
    apiRequest<ReadingsCountResponse>(
      `/api/monitoring-points/${pointId}/readings/count${toQuery(range)}`
    ),
  remove: (pointId: string, range: TimeSeriesRangeParams = {}) =>
    apiRequest<DeleteReadingsResponse>(
      `/api/monitoring-points/${pointId}/readings${toQuery(range)}`,
      { method: 'DELETE' }
    ),
  forecast: (pointId: string, horizon = 12) =>
    apiRequest<TimeSeriesForecastDto>(
      `/api/monitoring-points/${pointId}/readings/forecast${toQuery({ horizon })}`
    ),
  globalCount: () => apiRequest<ReadingsCountResponse>('/api/readings/count'),
};
