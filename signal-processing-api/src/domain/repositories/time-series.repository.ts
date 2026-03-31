import { TimeSeries } from '../entities/time-series.entity';

export interface TimeSeriesMetricsResult {
  datetime: string;
  max: number;
  rms?: number;
  kurtosis?: number;
  skewness?: number;
}

export interface MetricSeries {
  name: string;
  data: TimeSeriesMetricsResult[];
}

export const TIME_SERIES_REPOSITORY = 'TIME_SERIES_REPOSITORY';

export interface ITimeSeriesRepository {
  /**
   * Armazena uma série bruta, associando o insert_id original do mongo ou gerando um ID
   * Retorna o ID do registro inserido
   */
  save(timeSeries: TimeSeries): Promise<string>;

  /**
   * Obtém as métricas de modo agregado
   */
  getMetrics(id: string): Promise<MetricSeries[]>;

  /**
   * Retorna contagem
   */
  count(): Promise<number>;

  /**
   * Realiza um delete (soft ou hard)
   */
  delete(id: string): Promise<void>;

  /**
   * Retorna a série em sua integridade original
   */
  getById(id: string): Promise<TimeSeries | null>;
}
