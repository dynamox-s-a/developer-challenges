import axios from 'axios';
import { api } from '../api';
import type { MetricsResponse } from '../../features/data/types';
import { ERROR_MESSAGES } from '../../features/data/constants';
import { mapRawMetricsToMetricsResponse } from './metrics.mapper';
import type { RawMetricsResponse } from './type';

export const getMetrics = async (): Promise<MetricsResponse> => {
  try {
    const response = await api.get<RawMetricsResponse>('/metrics');
    return mapRawMetricsToMetricsResponse(response.data);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Erro na chamada get da API de Métricas:', error);
    }

    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK' || !error.response) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR, {
          cause: error,
        });
      }
    }

    throw new Error(ERROR_MESSAGES.FETCH_METRICS, {
      cause: error,
    });
  }
};
