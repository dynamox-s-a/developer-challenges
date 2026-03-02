import api from './client';
import type { DashboardMetrics } from '@dynamox/types';

export const reportsAPI = {
  getDashboardMetrics: () => api.get<DashboardMetrics>('/reports/dashboard/metrics'),
};
