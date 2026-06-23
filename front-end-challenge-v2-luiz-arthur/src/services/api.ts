import type { SensorDataResponse, MetricSeries } from '../types/sensor.types';

// Número total de séries disponíveis (0 a 6)
const TOTAL_INDICES = 7;

/**
 * Busca todos os dados dos sensores.
 * 
 * NOTA: Em um ambiente de produção, teríamos um único endpoint que retorna
 * o array completo. Porém, como o JSON Server serve HTML na raiz (devido à
 * pasta public), buscamos cada índice individualmente para garantir que
 * recebemos JSON puro.
 */
export const fetchAllMetrics = async (): Promise<SensorDataResponse> => {
  const promises = [];
  for (let i = 0; i < TOTAL_INDICES; i++) {
    promises.push(
      fetch(`http://localhost:3000/${i}`, {
        headers: { 'Accept': 'application/json' },
      }).then((res) => {
        if (!res.ok) throw new Error(`Erro ao buscar /${i}: ${res.status}`);
        return res.json();
      })
    );
  }

  const results = await Promise.all(promises);
  console.log('📊 Dados carregados:', results.length, 'séries');
  return results;
};

export const findMetricByName = (
  data: SensorDataResponse,
  name: string
): MetricSeries | null => {
  const found = data.find((item) => item.name === name);
  return found || null;
};