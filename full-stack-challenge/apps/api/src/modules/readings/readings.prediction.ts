/**
 * Pure forecasting over a short window of readings. Points are in ascending
 * time; `t` is epoch milliseconds. Callers guarantee at least two points with
 * distinct timestamps (unique per sensor), so the step is always positive.
 */
export interface Point {
  t: number;
  value: number;
}

/**
 * `horizon` timestamps after the last point, spaced by the window's average
 * interval, so a 5-minute series is forecast every 5 minutes.
 */
export function futureTimestamps(points: Point[], horizon: number): number[] {
  const first = points[0];
  const last = points[points.length - 1];
  const step = (last.t - first.t) / (points.length - 1);
  return Array.from({ length: horizon }, (_, i) =>
    Math.round(last.t + (i + 1) * step),
  );
}

/** Simple moving average: every future point is the window's mean (flat). */
export function movingAverageForecast(
  points: Point[],
  horizon: number,
): Point[] {
  const mean =
    points.reduce((sum, point) => sum + point.value, 0) / points.length;
  return futureTimestamps(points, horizon).map((t) => ({ t, value: mean }));
}

/**
 * Ordinary least squares of value over time, extrapolated to the future
 * timestamps. Time is measured from the last point, in seconds, to keep the
 * sums small and the fit numerically stable.
 */
export function linearRegressionForecast(
  points: Point[],
  horizon: number,
): Point[] {
  const origin = points[points.length - 1].t;
  const xs = points.map((point) => (point.t - origin) / 1000);
  const n = points.length;
  const meanX = xs.reduce((sum, x) => sum + x, 0) / n;
  const meanY = points.reduce((sum, point) => sum + point.value, 0) / n;

  let covariance = 0;
  let varianceX = 0;
  points.forEach((point, i) => {
    covariance += (xs[i] - meanX) * (point.value - meanY);
    varianceX += (xs[i] - meanX) ** 2;
  });
  const slope = covariance / varianceX;
  const intercept = meanY - slope * meanX;

  return futureTimestamps(points, horizon).map((t) => ({
    t,
    value: intercept + slope * ((t - origin) / 1000),
  }));
}
