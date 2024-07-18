import { describe, it, expect } from 'vitest';
import { formatChartData } from '../formatChartData';
import { DataPoint } from '../../interfaces/types';

describe('formatChartData', () => {
  it('should format data points correctly', () => {
    const points: DataPoint[] = [
      { datetime: '2024-07-18T00:00:00Z', max: 1 },
      { datetime: '2024-07-19T00:00:00Z', max: 2 },
    ];

    const expectedOutput: [number, number][] = [
      [new Date('2024-07-18T00:00:00Z').getTime(), 100],
      [new Date('2024-07-19T00:00:00Z').getTime(), 200],
    ];

    const result = formatChartData(points);
    expect(result).toEqual(expectedOutput);
  });

  it('should return an empty array for an empty input', () => {
    const points: DataPoint[] = [];
    const expectedOutput: [number, number][] = [];
    const result = formatChartData(points);
    expect(result).toEqual(expectedOutput);
  });
});
