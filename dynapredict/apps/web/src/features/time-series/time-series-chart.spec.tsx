import { render } from '@testing-library/react';
import {
  TimeSeriesChart,
  timeTickFormatter,
  toChartData,
} from './time-series-chart';

const samples = [
  { timestamp: '2026-11-22T10:00:00.000Z', value: 31.5 },
  { timestamp: '2026-11-22T10:10:00.000Z', value: 32 },
];

describe('toChartData', () => {
  it('should turn each instant into milliseconds for the time axis', () => {
    expect(toChartData(samples)).toEqual([
      { time: Date.UTC(2026, 10, 22, 10, 0), value: 31.5 },
      { time: Date.UTC(2026, 10, 22, 10, 10), value: 32 },
    ]);
  });
});

describe('timeTickFormatter', () => {
  const start = Date.UTC(2026, 10, 22, 13, 30);
  const hour = 60 * 60 * 1000;

  it('should show the hours when the series lasts up to two days', () => {
    const format = timeTickFormatter(start, start + 48 * hour);
    const expected = new Date(start).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    expect(format(start)).toBe(expected);
  });

  it('should show the days when the series is longer', () => {
    const format = timeTickFormatter(start, start + 49 * hour);
    const expected = new Date(start).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });

    expect(format(start)).toBe(expected);
  });
});

describe('TimeSeriesChart', () => {
  it('should draw the line of the series', () => {
    const { container } = render(
      <TimeSeriesChart samples={samples} unit="°C" mean={31.75} />,
    );

    expect(container.querySelector('.recharts-line')).toBeTruthy();
  });
});
