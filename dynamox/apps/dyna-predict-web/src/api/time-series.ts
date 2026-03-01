import api from './client';
import type {
  CreateTimeSeriesBatchRequest,
  CreateTimeSeriesBatchResponse,
  TimeSeriesListResponse,
  TimeSeriesMetricsResponse,
} from '@dynamox/types';

export const timeSeriesAPI = {
  getTimeSeries: (sensorUuid: string) => api.get<TimeSeriesListResponse>(`/time-series/${sensorUuid}`),
  getMetrics: (sensorUuid: string) => api.get<TimeSeriesMetricsResponse>(`/time-series/${sensorUuid}/metrics`),
  createTimeSeries: (sensorUuid: string, data: CreateTimeSeriesBatchRequest) => api.post<CreateTimeSeriesBatchResponse>(`/time-series/${sensorUuid}`, data),
  deleteAll: (sensorUuid: string) => api.delete(`/time-series/${sensorUuid}/all`),
};
