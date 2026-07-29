import { describe, it, expect } from 'vitest';
import {
  ChartTitle,
  MetricLabel,
  MetricUnit,
  YAxisTitle,
  type ChartData,
} from '../../features/data/types';
import theme from '../../theme/theme';
import { mapRawMetricsToMetricsResponse } from './metrics.mapper';
import type { RawMetricsResponse } from './type';

describe('Metrics Mapper Test', () => {
  it('should return empty object if rawMetrics is not array', () => {
    const metrics = mapRawMetricsToMetricsResponse({} as RawMetricsResponse);

    expect(metrics).toEqual({});
  });

  it('should map and group the metrics using resolvers', () => {
    const mockRawMetricsData: RawMetricsResponse = [
      {
        name: 'accelerationRms/x',
        data: [{ datetime: '2026-01-01T00:00:00.000Z', max: 1.5 }],
      },
    ];

    const metrics = mapRawMetricsToMetricsResponse(mockRawMetricsData);
    expect(metrics).toHaveProperty('accelerationRms');

    const accelerationRmsCategory = metrics.accelerationRms as ChartData;
    expect(accelerationRmsCategory.category).toBe('accelerationRms');
    expect(accelerationRmsCategory.chartTitle).toBe(ChartTitle.ACCELERATION);
    expect(accelerationRmsCategory.yAxisTitle).toBe(YAxisTitle.ACCELERATION);
    expect(accelerationRmsCategory.unit).toBe(MetricUnit.G);
    expect(accelerationRmsCategory.series).toHaveLength(1);

    const series = accelerationRmsCategory.series[0];
    expect(series.name).toBe('accelerationRms/x');
    expect(series.id).toBe('accelerationRms-x-series-0');
    expect(series.label).toBe(MetricLabel.AXIAL);
    expect(series.color).toBe(theme.palette.charts.accelerationX);
    expect(series.data).toHaveLength(mockRawMetricsData[0].data.length);
    expect(series.data[0][1]).toBe(mockRawMetricsData[0].data[0].max);
  });

  it('should map, group metrics, and reuse existing categories correctly', () => {
    // mesma categoria ('accelerationRms'), mas eixos diferentes
    const mockRawData: RawMetricsResponse = [
      {
        name: 'accelerationRms/x',
        data: [{ datetime: '2026-01-01T00:00:00.000Z', max: 1.5 }],
      },
      {
        name: 'accelerationRms/y',
        data: [{ datetime: '2026-01-01T00:00:00.000Z', max: 2.0 }],
      },
    ];

    const metrics = mapRawMetricsToMetricsResponse(mockRawData);
    const accelerationRmsCategory = metrics.accelerationRms as ChartData;

    expect(metrics).toHaveProperty('accelerationRms');
    expect(accelerationRmsCategory.series).toHaveLength(2);
    expect(accelerationRmsCategory.series[0].name).toBe('accelerationRms/x');
    expect(accelerationRmsCategory.series[1].name).toBe('accelerationRms/y');
  });
});
