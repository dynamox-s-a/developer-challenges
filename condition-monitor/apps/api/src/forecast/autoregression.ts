/**
 * A linear autoregression: each value is a weighted sum of the values before it, plus a
 * constant. The weights come from least squares, a closed formula, so the same history
 * always gives the same model, with no training to run (docs/forecast-study.md).
 *
 * The arithmetic is written for speed, on flat typed arrays and without copies: it runs
 * on the thread that serves every request, and seven forecasts are asked for at once
 * (docs/performance.md).
 */

/** The weights of the last `window` values, oldest first, then the constant. */
export type Model = Float64Array;

/**
 * The normal equations of a least squares problem, X'X and X'y, kept as sums so rows can
 * be added in steps. Only the upper triangle is summed: X'X is symmetric.
 */
class NormalEquations {
  /** Row-major, `size` rows of `size + 1` columns: X'X, then X'y in the last column. */
  private readonly sums: Float64Array;

  constructor(private readonly size: number) {
    this.sums = new Float64Array(size * (size + 1));
  }

  /** Adds the rows that predict `values[from]` up to `values[to - 1]` from their window. */
  addWindows(values: ArrayLike<number>, window: number, from: number, to: number): void {
    const { sums, size } = this;
    const width = size + 1;
    for (let target = from; target < to; target += 1) {
      const start = target - window;
      const y = values[target];
      for (let i = 0; i < window; i += 1) {
        const xi = values[start + i];
        const row = i * width;
        for (let j = i; j < window; j += 1) sums[row + j] += xi * values[start + j];
        // The constant column, and the target.
        sums[row + window] += xi;
        sums[row + size] += xi * y;
      }
      sums[window * width + window] += 1;
      sums[window * width + size] += y;
    }
  }

  /** Adds one row of any shape, for problems that are not windows of a series. */
  addRow(row: ArrayLike<number>, target: number): void {
    const { sums, size } = this;
    const width = size + 1;
    for (let i = 0; i < size; i += 1) {
      for (let j = i; j < size; j += 1) sums[i * width + j] += row[i] * row[j];
      sums[i * width + size] += row[i] * target;
    }
  }

  /** The weights that minimise the squared error, by Gauss-Jordan elimination. */
  solve(): Float64Array {
    const { size } = this;
    const width = size + 1;
    const a = Float64Array.from(this.sums);
    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < i; j += 1) a[i * width + j] = a[j * width + i];
    }
    // A whisker of ridge keeps nearly dependent columns solvable: neighbouring hours are
    // close to each other, and a constant series makes every lag the same column.
    let diagonal = 0;
    for (let i = 0; i < size; i += 1) diagonal += a[i * width + i];
    const ridge = 1e-9 * (diagonal / size || 1);
    for (let i = 0; i < size; i += 1) a[i * width + i] += ridge;

    for (let column = 0; column < size; column += 1) {
      let pivot = column;
      for (let row = column + 1; row < size; row += 1) {
        if (Math.abs(a[row * width + column]) > Math.abs(a[pivot * width + column])) pivot = row;
      }
      if (pivot !== column) {
        for (let k = 0; k < width; k += 1) {
          const kept = a[column * width + k];
          a[column * width + k] = a[pivot * width + k];
          a[pivot * width + k] = kept;
        }
      }
      const head = a[column * width + column];
      for (let row = 0; row < size; row += 1) {
        if (row === column) continue;
        const factor = a[row * width + column] / head;
        if (factor === 0) continue;
        for (let k = column; k < width; k += 1)
          a[row * width + k] -= factor * a[column * width + k];
      }
    }
    return Float64Array.from({ length: size }, (_, i) => a[i * width + size] / a[i * width + i]);
  }
}

/** Solves min |Xb - y| for rows of any shape. */
export function leastSquares(rows: number[][], targets: number[]): number[] {
  const equations = new NormalEquations(rows[0].length);
  rows.forEach((row, index) => equations.addRow(row, targets[index]));
  return [...equations.solve()];
}

export function fit(history: ArrayLike<number>, window: number): Model {
  const equations = new NormalEquations(window + 1);
  equations.addWindows(history, window, window, history.length);
  return equations.solve();
}

/**
 * Two models from one pass: `held` is fitted on the first `split` values only, to be
 * judged on the rest; `all` is fitted on everything, to be used. The sums of the first
 * are the starting point of the second.
 */
export function fitWithHoldout(
  values: ArrayLike<number>,
  window: number,
  split: number,
): { held: Model; all: Model } {
  const equations = new NormalEquations(window + 1);
  equations.addWindows(values, window, window, split);
  const held = equations.solve();
  equations.addWindows(values, window, split, values.length);
  return { held, all: equations.solve() };
}

/**
 * The `horizon` values after the first `length` values of the history. Each prediction
 * joins the history of the next one: beyond the first step the model feeds on its own
 * output, so errors add up, which is why the forecast comes with a band.
 */
export function predict(
  model: Model,
  history: ArrayLike<number>,
  horizon: number,
  length = history.length,
): number[] {
  const window = model.length - 1;
  // The last window of the history, then the predictions as they are made.
  const series = new Float64Array(window + horizon);
  for (let i = 0; i < window; i += 1) series[i] = history[length - window + i];
  for (let step = 0; step < horizon; step += 1) {
    let value = model[window];
    for (let i = 0; i < window; i += 1) value += model[i] * series[step + i];
    series[window + step] = value;
  }
  return [...series.subarray(window)];
}

/** Each hour as it was 24 hours before: the baseline a daily cycle makes hard to beat. */
export function sameHourYesterday(
  history: ArrayLike<number>,
  horizon: number,
  length = history.length,
): number[] {
  return Array.from({ length: horizon }, (_, step) => history[length - 24 + (step % 24)]);
}

export interface Backtest {
  /** Forecasts made, one per origin. */
  forecasts: number;
  /** Mean absolute error of the model and of the baseline, over every hour ahead. */
  error: number;
  baselineError: number;
  /** For each hour ahead, the absolute error that `coverage` of the forecasts stayed within. */
  band: number[];
}

/**
 * Judges a model on the part of the history it was not fitted on: the values from
 * `split` on. From every hour of that part that leaves `horizon` hours ahead of it, the
 * model predicts them seeing only what came before, and each prediction is compared with
 * what happened. Null when that part is too short for a single forecast.
 */
export function backtest(
  values: ArrayLike<number>,
  model: Model,
  split: number,
  options: { horizon: number; coverage: number },
): Backtest | null {
  const { horizon } = options;
  if (split + horizon > values.length) return null;

  const errorsAt: number[][] = Array.from({ length: horizon }, () => []);
  let errorSum = 0;
  let baselineSum = 0;
  let forecasts = 0;
  for (let origin = split; origin + horizon <= values.length; origin += 1) {
    const predicted = predict(model, values, horizon, origin);
    for (let step = 0; step < horizon; step += 1) {
      const actual = values[origin + step];
      const error = Math.abs(predicted[step] - actual);
      errorsAt[step].push(error);
      errorSum += error;
      baselineSum += Math.abs(values[origin - 24 + (step % 24)] - actual);
    }
    forecasts += 1;
  }
  const count = forecasts * horizon;
  return {
    forecasts,
    error: errorSum / count,
    baselineError: baselineSum / count,
    band: errorsAt.map((errors) => quantile(errors, options.coverage)),
  };
}

/** The value below which the given share of the numbers falls. */
export function quantile(numbers: number[], share: number): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(share * sorted.length) - 1)];
}
