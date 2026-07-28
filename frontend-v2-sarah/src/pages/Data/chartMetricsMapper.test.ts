import { describe, it, expect } from 'vitest';
import { getValidCharts } from './chartMetricsMapper';
import type { MetricsResponse } from '../../features/data/types';
import {
  mockChartDataAcceleration,
  mockChartDataVelocity,
  mockMetricsResponse,
  mockValidCharts,
} from '../../mocks/metricsMock';

describe('getValidCharts Mapper Test', () => {
  it('should return an empty array if metrics is an empty object', () => {
    const result = getValidCharts({} as MetricsResponse);

    expect(result).toEqual([]);
  });

  it('should only return charts that contain valid data', () => {
    const mockMetrics: MetricsResponse = {
      accelerationRms: mockChartDataAcceleration,
      temperature: undefined,
      velocityRms: mockChartDataVelocity,
    };

    const result = getValidCharts(mockMetrics);

    expect(result).toEqual([
      { id: 'accelleration', data: mockChartDataAcceleration },
      { id: 'velocity', data: mockChartDataVelocity },
    ]);
  });

  it('should return all graphs if they are all valid', () => {
    const result = getValidCharts(mockMetricsResponse);

    expect(result).toHaveLength(3);
    expect(result).toEqual(mockValidCharts);
  });

  it('should return an empty array if all metrics are undefined', () => {
    const mockMetrics: MetricsResponse = {
      accelerationRms: undefined,
      temperature: undefined,
      velocityRms: undefined,
    };

    const result = getValidCharts(mockMetrics);

    expect(result).toEqual([]);
  });
});
