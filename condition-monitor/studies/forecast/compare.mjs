// Compares forecasting candidates on series stored by the simulator, to choose the model
// of the forecast route by measurement (docs/forecast-study.md).
//
// It reads the series through the API, so it needs the API running and the plant
// described in the study. Usage, from the workspace root:
//   node studies/forecast/compare.mjs
import { existsSync } from 'node:fs';

if (existsSync('.env')) process.loadEnvFile('.env');
const API = process.env.API_URL ?? 'http://localhost:3000/api';
const EMAIL = process.env.SIMULATOR_EMAIL ?? process.env.SEED_USER_EMAIL;
const PASSWORD = process.env.SIMULATOR_PASSWORD ?? process.env.SEED_USER_PASSWORD;

const HOUR = 3_600_000;
/** Hours of history each prediction looks at, and hours it predicts. */
const WINDOW = Number(process.env.WINDOW ?? 48);
const HORIZON = 24;
/** A new forecast origin every this many hours of the validation part. */
const ORIGIN_STEP = 6;
/** The last fifth of each series is kept for validation, in time order. */
const TRAIN_SHARE = 0.8;

const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const std = (values) => {
  const center = mean(values);
  return Math.sqrt(mean(values.map((value) => (value - center) ** 2)));
};

/** Solves the least squares problem min |Xb - y| by the normal equations. */
function leastSquares(rows, targets) {
  const n = rows[0].length;
  const a = Array.from({ length: n }, () => new Float64Array(n + 1));
  rows.forEach((row, index) => {
    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < n; j += 1) a[i][j] += row[i] * row[j];
      a[i][n] += row[i] * targets[index];
    }
  });
  // A whisker of ridge keeps nearly dependent columns, such as close lags, solvable.
  const ridge = 1e-9 * mean(a.map((row, index) => row[index]));
  for (let i = 0; i < n; i += 1) a[i][i] += ridge;
  for (let column = 0; column < n; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < n; row += 1) {
      if (Math.abs(a[row][column]) > Math.abs(a[pivot][column])) pivot = row;
    }
    [a[column], a[pivot]] = [a[pivot], a[column]];
    for (let row = 0; row < n; row += 1) {
      if (row === column) continue;
      const factor = a[row][column] / a[column][column];
      for (let k = column; k <= n; k += 1) a[row][k] -= factor * a[column][k];
    }
  }
  return a.map((row, index) => row[n] / row[index]);
}

/**
 * Candidates. Each receives the hourly history up to the origin and answers the next
 * HORIZON hourly values. All of them use everything known at the origin, and nothing after.
 */
const CANDIDATES = {
  'Last value': (history) => Array(HORIZON).fill(history.at(-1)),
  'Same hour yesterday': (history) =>
    Array.from({ length: HORIZON }, (_, step) => history[history.length - 24 + (step % 24)]),
  'Mean of the history': (history) => Array(HORIZON).fill(mean(history)),
  // The window of values predicts the next one; the forecast feeds on its own output.
  'Linear autoregression': (history) => {
    const rows = [];
    const targets = [];
    for (let i = WINDOW; i < history.length; i += 1) {
      rows.push([...history.slice(i - WINDOW, i), 1]);
      targets.push(history[i]);
    }
    const coefficients = leastSquares(rows, targets);
    const series = [...history];
    for (let step = 0; step < HORIZON; step += 1) {
      const window = series.slice(-WINDOW);
      series.push(
        window.reduce((sum, value, i) => sum + value * coefficients[i], coefficients[WINDOW]),
      );
    }
    return series.slice(-HORIZON);
  },
  // A straight line through the last two weeks, plus the mean departure of each hour of
  // the day from that line.
  'Trend and daily profile': (history) => {
    const recent = history.slice(-14 * 24);
    const offset = history.length - recent.length;
    const [slope, intercept] = leastSquares(
      recent.map((_, i) => [i, 1]),
      recent,
    );
    const departures = Array.from({ length: 24 }, () => []);
    recent.forEach((value, i) =>
      departures[(offset + i) % 24].push(value - (slope * i + intercept)),
    );
    const profile = departures.map((values) => (values.length > 0 ? mean(values) : 0));
    return Array.from({ length: HORIZON }, (_, step) => {
      const i = recent.length + step;
      return slope * i + intercept + profile[(offset + i) % 24];
    });
  },
};

async function login() {
  const response = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const cookie = response.headers.getSetCookie()[0]?.split(';')[0];
  if (response.status !== 204 || !cookie) throw new Error(`Login failed with ${response.status}.`);
  return async (path) => {
    const answer = await fetch(`${API}${path}`, { headers: { Cookie: cookie } });
    if (!answer.ok) throw new Error(`GET ${path} answered ${answer.status}.`);
    return answer.json();
  };
}

/** Mean of the readings of each whole hour, the first and last hours left out. */
function hourlyMeans(readings) {
  const hours = new Map();
  for (const { timestamp, value } of readings) {
    const hour = Math.floor(Date.parse(timestamp) / HOUR);
    hours.set(hour, [...(hours.get(hour) ?? []), value]);
  }
  const keys = [...hours.keys()].sort((a, b) => a - b).slice(1, -1);
  for (let i = 1; i < keys.length; i += 1) {
    if (keys[i] !== keys[i - 1] + 1) throw new Error('The series has a gap; the study needs none.');
  }
  return keys.map((key) => mean(hours.get(key)));
}

/** Absolute errors of a candidate at each hour ahead, over every origin of the validation part. */
function backtest(values, forecast) {
  const split = Math.floor(values.length * TRAIN_SHARE);
  const errors = Array.from({ length: HORIZON }, () => []);
  for (let origin = split; origin + HORIZON <= values.length; origin += ORIGIN_STEP) {
    const predicted = forecast(values.slice(0, origin));
    predicted.forEach((value, step) => errors[step].push(Math.abs(value - values[origin + step])));
  }
  return errors;
}

const get = await login();
const sensors = await get('/sensors');
const degrading = new Set((process.env.DEGRADING ?? 'SIM-0002,SIM-0004').split(','));
const groups = new Map();
let origins = 0;
for (const sensor of sensors) {
  for (const series of await get(`/monitoring-points/${sensor.monitoringPointId}/time-series`)) {
    const { readings } = await get(`/time-series/${series.id}/readings`);
    const values = hourlyMeans(readings);
    const scale = std(values.slice(0, Math.floor(values.length * TRAIN_SHARE)));
    const kind = series.quantity === 'temperature' ? 'temperature' : 'vibration';
    const group = `${degrading.has(sensor.serialNumber) ? 'Degrading' : 'Healthy'} ${kind}`;
    const entry = groups.get(group) ?? { series: 0, hours: values.length, errors: {} };
    entry.series += 1;
    for (const [name, forecast] of Object.entries(CANDIDATES)) {
      const errors = backtest(values, forecast);
      origins = errors[0].length;
      // In standard deviations of the series, so series of different units can be averaged.
      const scaled = errors.map((atStep) => mean(atStep) / scale);
      (entry.errors[name] ??= []).push(scaled);
    }
    groups.set(group, entry);
  }
}

const AT = [1, 6, 12, 24];
console.log(
  `Hourly means, window of ${WINDOW} h, horizon of ${HORIZON} h, ${origins} origins per series.`,
);
console.log('Mean absolute error, in standard deviations of each series.\n');
for (const [group, entry] of [...groups].sort()) {
  console.log(`### ${group} (${entry.series} series, ${entry.hours} hours each)\n`);
  console.log(
    `| Candidate | ${AT.map((hour) => `${hour} h ahead`).join(' | ')} | Mean of the 24 h |`,
  );
  console.log(`|---|${AT.map(() => '---').join('|')}|---|`);
  for (const [name, perSeries] of Object.entries(entry.errors)) {
    const atStep = (step) => mean(perSeries.map((scaled) => scaled[step]));
    const overall = mean(perSeries.map((scaled) => mean(scaled)));
    console.log(
      `| ${name} | ${AT.map((hour) => atStep(hour - 1).toFixed(2)).join(' | ')} | ${overall.toFixed(2)} |`,
    );
  }
  console.log('');
}
