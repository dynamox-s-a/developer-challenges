import api from "./api.js"; 

export type TimeSeriesPoint = {
  id: string;
  monitoringPointId: string;
  timestamp: string;
  value: number;
};

export type TimeSeriesListResponse = {
  items: TimeSeriesPoint[];
  total: number;
  take: number;
  skip: number;
};

export type TimeSeriesMetrics = {
  count: number;
  min: number | null;
  max: number | null;
  avg: number | null;
};

export async function fetchTimeSeries(
  monitoringPointId: string,
  params: { take?: number; skip?: number; from?: string; to?: string } = {}
) {
  const { data } = await api.get<TimeSeriesListResponse>(
    `/monitoring-points/${monitoringPointId}/time-series`,
    { params }
  );
  return data;
}

export async function fetchTimeSeriesMetrics(
  monitoringPointId: string,
  params: { from?: string; to?: string } = {}
) {
  const { data } = await api.get<TimeSeriesMetrics>(
    `/monitoring-points/${monitoringPointId}/time-series/metrics`,
    { params }
  );
  return data;
}

export async function createTimeSeriesPoint(
  monitoringPointId: string,
  data: { timestamp: string; value: number }
) {
  const response = await api.post<TimeSeriesPoint>(
    `/monitoring-points/${monitoringPointId}/time-series`,
    data
  );
  return response.data;
}