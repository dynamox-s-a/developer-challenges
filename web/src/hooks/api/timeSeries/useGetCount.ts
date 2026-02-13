import { useCallback, useState } from 'react';
import { CountResponseWrapperSchema } from '@/types/zod/timeSeries';

export const useGetCount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = useCallback(async (
    monitoringPointId: string
  ): Promise<{ success: boolean; count?: number; message?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/time-series/${monitoringPointId}/count`);
      const resp = await response.json();
      const parsed = CountResponseWrapperSchema.parse(resp);

      if (!parsed.success) {
        setError(parsed.message);
        return { success: false, message: parsed.message };
      }

      if (!parsed.data) {
        setError('Nenhum dado de contagem encontrado');
        return { success: false, message: 'Nenhum dado de contagem encontrado' };
      }

      return { success: true, count: parsed.data.count };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchCount, loading, error };
};