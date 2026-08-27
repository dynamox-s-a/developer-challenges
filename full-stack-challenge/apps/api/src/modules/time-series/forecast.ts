export interface ForecastPoint {
  timestamp: string;
  value: number;
}

export interface LinearForecastInput {
  timestampMs: number;
  value: number;
}

/**
 * Simple least-squares linear regression forecast.
 * Suitable as a transparent demo predictor (not a production ML model).
 */
export function forecastLinear(
  history: LinearForecastInput[],
  horizon: number,
  intervalMs?: number
): ForecastPoint[] {
  if (history.length < 2) {
    throw new Error('At least 2 readings are required to forecast');
  }
  if (horizon < 1) {
    throw new Error('Horizon must be at least 1');
  }

  const n = history.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = history[i].value;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }

  const denominator = n * sumXX - sumX * sumX;
  const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  const last = history[n - 1];
  const prev = history[n - 2];
  const stepMs =
    intervalMs && intervalMs > 0
      ? intervalMs
      : Math.max(1_000, last.timestampMs - prev.timestampMs);

  const predictions: ForecastPoint[] = [];
  for (let step = 1; step <= horizon; step++) {
    const x = n - 1 + step;
    predictions.push({
      timestamp: new Date(last.timestampMs + step * stepMs).toISOString(),
      value: Number((intercept + slope * x).toFixed(4)),
    });
  }

  return predictions;
}
