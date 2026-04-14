import { Sample, TimeSeriesMetrics } from '../types/timeSeries';

export class TimeSeriesMetricsService {
  calculate(samples: Sample[]): TimeSeriesMetrics {
    const values = samples.map((sample) => sample.value);

    const sum = values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const count = values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const average = sum / count;
    const range = max - min;

    const sortedSamples = [...samples].sort(
      (left, right) => left.timestamp.getTime() - right.timestamp.getTime()
    );

    const firstTimestamp = sortedSamples[0].timestamp;
    const lastTimestamp = sortedSamples[sortedSamples.length - 1].timestamp;

    return {
      count,
      min,
      max,
      average,
      sum,
      range,
      firstTimestamp,
      lastTimestamp
    };
  }
}

export const timeSeriesMetricsService = new TimeSeriesMetricsService();