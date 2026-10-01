/**
 * How a forecast is made, chosen by measurement (docs/forecast-study.md): a linear
 * autoregression over hourly means.
 */
export const FORECAST = {
  /** Hours of history each predicted hour is computed from. */
  windowHours: 48,
  /** Hours predicted ahead. */
  horizonHours: 24,
  /** Continuous hours of history a forecast needs: a week, of which a fifth judges it. */
  minHistoryHours: 7 * 24,
  /**
   * History used at most. A month keeps the model about how the machine runs now, and
   * keeps the computation short: it runs on the thread that serves every request
   * (docs/performance.md).
   */
  maxHistoryHours: 30 * 24,
  /** Share of the history, in time order, the model is fitted on when it is judged. */
  trainShare: 0.8,
  /** Share of the validation errors the band around the forecast covers. */
  bandCoverage: 0.9,
} as const;

/** One predicted hour: the mean expected in it, and the band it should fall within. */
export interface ForecastPoint {
  /** The middle of the hour, since the value is the mean of the hour. */
  timestamp: string;
  value: number;
  lower: number;
  upper: number;
}

export interface ForecastAvailable {
  status: 'available';
  /** The hourly history the model was fitted on. */
  basedOn: { from: string; to: string; hours: number };
  /**
   * How the model did on the last fifth of that history, which it had not seen, against
   * the baseline "same hour yesterday". Mean absolute errors, in the unit of the series.
   * A model that does not beat the baseline is not worth trusting over it.
   */
  validation: { forecasts: number; error: number; baselineError: number };
  points: ForecastPoint[];
}

/** No forecast, and why: an answer, not an error, and never an invented line. */
export interface ForecastUnavailable {
  status: 'unavailable';
  reason: 'not-enough-history';
  detail: string;
}

export type Forecast = ForecastAvailable | ForecastUnavailable;
