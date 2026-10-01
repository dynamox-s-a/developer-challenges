import { FORECAST } from '@condition-monitor/shared';
import { buildForecast, type HourlyMean } from './build-forecast';

const START = Date.UTC(2026, 8, 1);
const HOUR = 3_600_000;

/** Hourly means with a daily cycle; `skip` removes hours, to make gaps. */
function means(hours: number, skip: (hour: number) => boolean = () => false): HourlyMean[] {
  return Array.from({ length: hours }, (_, hour) => hour)
    .filter((hour) => !skip(hour))
    .map((hour) => ({
      hour: new Date(START + hour * HOUR),
      value: 2 + 0.5 * Math.sin((2 * Math.PI * hour) / 24) + 0.05 * Math.sin(hour * 12.9898),
    }));
}

describe('buildForecast', () => {
  it('predicts the 24 hours after the last complete hour, each with its band', () => {
    // 10 days and one more hour: the last hour may be incomplete and is left out.
    const forecast = buildForecast(means(241));

    if (forecast.status !== 'available') throw new Error(forecast.detail);
    expect(forecast.basedOn).toEqual({
      from: new Date(START).toISOString(),
      to: new Date(START + 240 * HOUR).toISOString(),
      hours: 240,
    });
    expect(forecast.points).toHaveLength(FORECAST.horizonHours);
    // The middle of the first hour after the history, then one per hour.
    expect(forecast.points[0].timestamp).toBe(new Date(START + 240.5 * HOUR).toISOString());
    expect(forecast.points[23].timestamp).toBe(new Date(START + 263.5 * HOUR).toISOString());
    for (const point of forecast.points) {
      expect(point.lower).toBeLessThanOrEqual(point.value);
      expect(point.upper).toBeGreaterThanOrEqual(point.value);
    }
    expect(forecast.validation.forecasts).toBeGreaterThan(0);
    expect(forecast.validation.error).toBeLessThan(forecast.validation.baselineError);
  });

  it('needs a week of history: 168 complete hours are enough, 167 are not', () => {
    expect(buildForecast(means(169)).status).toBe('available');
    expect(buildForecast(means(168))).toEqual({
      status: 'unavailable',
      reason: 'not-enough-history',
      detail:
        'The series has 167 hours of continuous history up to its latest reading; a forecast needs 168.',
    });
  });

  it('uses only the hours after the last gap, without bridging it', () => {
    // 20 days with one hour missing 5 days before the end: 119 continuous hours remain.
    const withGap = buildForecast(means(481, (hour) => hour === 360));
    // The same gap 10 days before the end leaves enough.
    const enough = buildForecast(means(481, (hour) => hour === 240));

    expect(withGap).toMatchObject({ status: 'unavailable' });
    expect(withGap.status === 'unavailable' && withGap.detail).toMatch(/^The series has 119 hours/);
    expect(enough.status === 'available' && enough.basedOn.hours).toBe(239);
  });

  it('answers no forecast for an empty series', () => {
    expect(buildForecast([])).toMatchObject({
      status: 'unavailable',
      reason: 'not-enough-history',
    });
  });

  it('keeps the forecast and its lower bound from going below the floor of the quantity', () => {
    const low = means(241).map((mean) => ({ ...mean, value: mean.value - 1.9 }));

    const forecast = buildForecast(low, 0);

    if (forecast.status !== 'available') throw new Error(forecast.detail);
    expect(Math.min(...forecast.points.map((point) => point.lower))).toBeGreaterThanOrEqual(0);
  });

  it('looks back at most 30 days', () => {
    const forecast = buildForecast(means(40 * 24 + 1));

    expect(forecast.status === 'available' && forecast.basedOn.hours).toBe(
      FORECAST.maxHistoryHours,
    );
  });
});
