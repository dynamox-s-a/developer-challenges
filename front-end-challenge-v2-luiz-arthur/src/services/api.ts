import type { SensorDataResponse, MetricSeries } from '../types/sensor.types';

/**
 * Busca os dados dos sensores a partir do arquivo estático na pasta public.
 * Essa abordagem funciona tanto em desenvolvimento quanto em produção.
 */
export const fetchAllMetrics = async (): Promise<SensorDataResponse> => {
  const response = await fetch('/response-challenge-v2.json');
  if (!response.ok) {
    throw new Error(`Erro ao carregar dados: ${response.status}`);
  }
  const data = await response.json();
  if (Array.isArray(data)) {
    return data;
  }
  throw new Error('Formato de dados inesperado.');
};

export const findMetricByName = (
  data: SensorDataResponse,
  name: string
): MetricSeries | null => {
  const found = data.find((item) => item.name === name);
  return found || null;
};