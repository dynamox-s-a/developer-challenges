import { FORECAST, type Forecast } from '@condition-monitor/shared';
import { backtest, fitWithHoldout, predict } from './autoregression';

const HOUR = 3_600_000;

/** The mean of the readings of one hour; `hour` is the start of that hour. */
export interface HourlyMean {
  hour: Date;
  value: number;
}

/**
 * The forecast of a series from its hourly means, in time order, or the reason there is
 * none. `floor` is the lowest value the quantity can have, such as zero for an RMS.
 *
 * The last hour is left out: it is the hour of the latest reading and may still be
 * filling up. Only the hours without a gap up to there are used, since the model reads
 * a window of consecutive hours; a gap is not bridged with invented values.
 */
export function buildForecast(means: HourlyMean[], floor: number | null = null): Forecast {
  const complete = means.slice(0, -1);
  let start = complete.length - 1;
  while (
    start > 0 &&
    complete[start].hour.getTime() - complete[start - 1].hour.getTime() === HOUR
  ) {
    start -= 1;
  }
  const continuous = complete.slice(Math.max(start, complete.length - FORECAST.maxHistoryHours));

  if (continuous.length < FORECAST.minHistoryHours) {
    return {
      status: 'unavailable',
      reason: 'not-enough-history',
      detail: `The series has ${continuous.length} hours of continuous history up to its latest reading; a forecast needs ${FORECAST.minHistoryHours}.`,
    };
  }

  const values = Float64Array.from(continuous, (mean) => mean.value);
  // Judged on a model that had not seen the last fifth; used with everything known.
  const split = Math.floor(values.length * FORECAST.trainShare);
  const models = fitWithHoldout(values, FORECAST.windowHours, split);
  const judged = backtest(values, models.held, split, {
    horizon: FORECAST.horizonHours,
    coverage: FORECAST.bandCoverage,
  });
  if (!judged) {
    // Unreachable while the minimum history leaves room for a forecast to judge.
    throw new Error('The minimum history is too short to judge a forecast.');
  }

  const predicted = predict(models.all, values, FORECAST.horizonHours);
  const last = continuous[continuous.length - 1].hour.getTime();
  return {
    status: 'available',
    basedOn: {
      from: continuous[0].hour.toISOString(),
      to: new Date(last + HOUR).toISOString(),
      hours: continuous.length,
    },
    validation: {
      forecasts: judged.forecasts,
      error: judged.error,
      baselineError: judged.baselineError,
    },
    points: predicted.map((value, step) => {
      const lower = value - judged.band[step];
      return {
        timestamp: new Date(last + (step + 1) * HOUR + HOUR / 2).toISOString(),
        value: floor === null ? value : Math.max(floor, value),
        lower: floor === null ? lower : Math.max(floor, lower),
        upper: value + judged.band[step],
      };
    }),
  };
}
