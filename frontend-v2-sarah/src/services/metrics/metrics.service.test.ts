import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { api } from '../api';
import { ERROR_MESSAGES } from '../../features/data/constants';
import type { MetricsResponse } from '../../features/data/types';
import { mockChartDataAcceleration } from '../../mocks/metricsMock';
import { getMetrics } from './metrics.service';
import { mapRawMetricsToMetricsResponse } from './metrics.mapper';
import type { RawMetricsResponse } from './type';

vi.mock('../api', () => ({
  api: {
    get: vi.fn(),
  },
}));

vi.mock('./metrics.mapper', () => ({
  mapRawMetricsToMetricsResponse: vi.fn(),
}));

describe('getMetrics Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve buscar as métricas com sucesso e retornar o resultado mapeado', async () => {
    const mockRawMetricsData: RawMetricsResponse = [
      {
        name: 'accelerationRms/x',
        data: [{ datetime: '2026-01-01T00:00:00.000Z', max: 1.5 }],
      },
      {
        name: 'accelerationRms/y',
        data: [{ datetime: '2026-01-01T00:00:00.000Z', max: 2.0 }],
      },
    ];
    const mockMetricMappedData: MetricsResponse = {
      accelerationRms: mockChartDataAcceleration,
    };

    vi.mocked(api.get).mockResolvedValueOnce({ data: mockRawMetricsData });
    vi.mocked(mapRawMetricsToMetricsResponse).mockReturnValueOnce(
      mockMetricMappedData,
    );

    const result = await getMetrics();

    expect(api.get).toHaveBeenCalledWith('/metrics');
    expect(mapRawMetricsToMetricsResponse).toHaveBeenCalledWith(
      mockRawMetricsData,
    );
    expect(result).toEqual(mockMetricMappedData);
  });

  it('deve lançar erro de rede formatado quando o axios retornar erro', async () => {
    const networkErrorMock = {
      code: 'ERR_NETWORK',
      response: undefined,
      isAxiosError: true,
    };

    // força para o isAxiosError retornar true
    vi.spyOn(axios, 'isAxiosError').mockReturnValueOnce(true);
    vi.mocked(api.get).mockRejectedValueOnce(networkErrorMock);

    await expect(getMetrics()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR);
  });

  it('deve lançar erro genérico de fetch quando ocorrer outro tipo de erro', async () => {
    const serverError = new Error('Erro do servidor');

    vi.spyOn(axios, 'isAxiosError').mockReturnValueOnce(false);
    vi.mocked(api.get).mockRejectedValueOnce(serverError);

    await expect(getMetrics()).rejects.toThrow(ERROR_MESSAGES.FETCH_METRICS);
  });
});
