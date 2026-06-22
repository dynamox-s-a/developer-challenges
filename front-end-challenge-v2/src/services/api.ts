import axios from 'axios';
import type { SensorDataResponse } from '../types/sensor.types';
import type { MetricSeries } from '../types/sensor.types';

// Configuração do Axios
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchAllMetrics = async (): Promise<SensorDataResponse> => {
  const response = await api.get<SensorDataResponse>('/');
  return response.data;
};

export const findMetricByName = (
  data: SensorDataResponse,
  name: string
): MetricSeries | null => {
  const found = data.find((item) => item.name === name);
  return found || null;
};