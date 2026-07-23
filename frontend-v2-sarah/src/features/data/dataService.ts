import { api } from '../../services/api';
import type { MetricsResponse } from './types';

export async function getMetrics(): Promise<MetricsResponse> {
  const response = await api.get<MetricsResponse>('/metrics');
  return response.data;
}
