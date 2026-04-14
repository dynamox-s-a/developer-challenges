import { timeSeriesMetricsService } from '../../src/services/timeSeriesMetrics.service';

describe('MetricsService', () => {
  it('should calculate metrics correctly', () => {
    const samples = [
      { timestamp: new Date('2026-04-11T10:00:02.000Z'), value: 15 },
      { timestamp: new Date('2026-04-11T10:00:00.000Z'), value: 10 },
      { timestamp: new Date('2026-04-11T10:00:01.000Z'), value: 20 },
    ];

    const result = timeSeriesMetricsService.calculate(samples);

    expect(result).toEqual({
      count: 3,
      min: 10,
      max: 20,
      sum: 45,
      average: 15,
      range: 10,
      firstTimestamp: new Date('2026-04-11T10:00:00.000Z'),
      lastTimestamp: new Date('2026-04-11T10:00:02.000Z'),
    });
  });
});