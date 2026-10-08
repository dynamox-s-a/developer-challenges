import {
  futureTimestamps,
  linearRegressionForecast,
  movingAverageForecast,
  type Point,
} from './readings.prediction';

const T0 = Date.UTC(2026, 9, 3, 12);
const MINUTE = 60_000;

/** Points one minute apart with the given values. */
function perMinute(values: number[]): Point[] {
  return values.map((value, i) => ({ t: T0 + i * MINUTE, value }));
}

describe('futureTimestamps', () => {
  it('continues a regular series at the same step', () => {
    expect(futureTimestamps(perMinute([1, 2, 3]), 2)).toEqual([
      T0 + 3 * MINUTE,
      T0 + 4 * MINUTE,
    ]);
  });

  it("uses the window's average interval for irregular series", () => {
    const points = [0, 10, 40].map((seconds) => ({
      t: T0 + seconds * 1000,
      value: 0,
    }));

    // Average step: 40s / 2 = 20s.
    expect(futureTimestamps(points, 2)).toEqual([T0 + 60_000, T0 + 80_000]);
  });
});

describe('movingAverageForecast', () => {
  it("forecasts the window's mean at every future point", () => {
    expect(movingAverageForecast(perMinute([2, 4, 9]), 3)).toEqual([
      { t: T0 + 3 * MINUTE, value: 5 },
      { t: T0 + 4 * MINUTE, value: 5 },
      { t: T0 + 5 * MINUTE, value: 5 },
    ]);
  });
});

describe('linearRegressionForecast', () => {
  it('continues a perfectly linear series exactly', () => {
    // value = 3 + 0.5 per minute
    const points = perMinute([3, 3.5, 4, 4.5]);

    const forecast = linearRegressionForecast(points, 3);

    expect(forecast.map((point) => point.t)).toEqual([
      T0 + 4 * MINUTE,
      T0 + 5 * MINUTE,
      T0 + 6 * MINUTE,
    ]);
    [5, 5.5, 6].forEach((expected, i) => {
      expect(forecast[i].value).toBeCloseTo(expected, 9);
    });
  });

  it('fits the least-squares line through noisy values', () => {
    // x = 0..3 min, mean 1.5; y mean 2.5; slope = 4 / 5 = 0.8 per minute,
    // so at x = 4: 2.5 + 0.8 * (4 - 1.5) = 4.5.
    const [next] = linearRegressionForecast(perMinute([1, 3, 2, 4]), 1);

    expect(next.value).toBeCloseTo(4.5, 9);
  });

  it('forecasts a flat line for a constant series', () => {
    const forecast = linearRegressionForecast(perMinute([7, 7, 7]), 2);

    forecast.forEach((point) => expect(point.value).toBeCloseTo(7, 9));
  });

  it('follows a decreasing trend below the last value', () => {
    const [next] = linearRegressionForecast(perMinute([10, 8, 6]), 1);

    expect(next.value).toBeCloseTo(4, 9);
  });
});
