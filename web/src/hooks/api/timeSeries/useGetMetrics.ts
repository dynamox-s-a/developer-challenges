import { useCallback, useState } from 'react';
import {
  TimeSeriesMetricsResponseSchema,
  type TimeSeriesMetrics,
} from '@/types/zod/timeSeries';

export const useGetMetrics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async (monitoringPointId: string): Promise<{
    success: boolean;
    data?: TimeSeriesMetrics;
    message?: string;
  }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/time-series/${monitoringPointId}/metrics`);
      const resp = await response.json();
      const parsed = TimeSeriesMetricsResponseSchema.parse(resp);

      if (!parsed.success) {
        setError(parsed.message);
        return { success: false, message: parsed.message };
      }

      return { success: true, data: parsed.data };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchMetrics, loading, error };
};