// Latency of every API route under load (assumption D1), run by k6 inside Docker:
// npm run load:test. Each route passes when 99 % of its requests answer below 350 ms.
/* global __ENV */
import exec from 'k6/execution';
import http from 'k6/http';
import { check, sleep } from 'k6';

const API = __ENV.API_URL;
const LIMIT_MS = 350;
const WARMUP = '20s';
const MEASURE = '2m';
/** The sensor whose series are full (49,968 readings): read, never written to. */
const FULL_SENSOR = 'LD-0001';
/** The sensors the writers send to, LD-0061 to LD-0080: the other 60 are only read. */
const WRITTEN = /^LD-00(6[1-9]|7\d|80)$/;

/**
 * Route names, as templates, so every id of a route counts as one route. No commas: k6
 * splits the tags of a threshold on them.
 */
const R = {
  health: 'GET /api/health',
  login: 'POST /api/auth/login',
  me: 'GET /api/auth/me',
  logout: 'POST /api/auth/logout',
  overview: 'GET /api/overview',
  sectors: 'GET /api/sectors',
  createSector: 'POST /api/sectors',
  updateSector: 'PATCH /api/sectors/:id',
  deleteSector: 'DELETE /api/sectors/:id',
  machines: 'GET /api/machines',
  nextNumber: 'GET /api/machines/next-number',
  createMachine: 'POST /api/machines',
  machine: 'GET /api/machines/:id',
  updateMachine: 'PATCH /api/machines/:id',
  deleteMachine: 'DELETE /api/machines/:id',
  points: 'GET /api/monitoring-points',
  addPositions: 'POST /api/machines/:id/monitoring-points',
  point: 'GET /api/monitoring-points/:id',
  updatePoint: 'PATCH /api/monitoring-points/:id',
  deletePoint: 'DELETE /api/monitoring-points/:id',
  installSensor: 'PUT /api/monitoring-points/:id/sensor',
  removeSensor: 'DELETE /api/monitoring-points/:id/sensor',
  sensors: 'GET /api/sensors',
  series: 'GET /api/monitoring-points/:id/time-series',
  metrics: 'GET /api/time-series/:id/metrics',
  readings: 'GET /api/time-series/:id/readings',
  forecast: 'GET /api/time-series/:id/forecast',
  deleteSeries: 'DELETE /api/time-series/:id',
  ingest: 'POST /api/readings (14 readings)',
  ingestBulk: '',
  importCsv: 'POST /api/imports (1008 lines)',
};

/**
 * Instants of the largest submission, 7 readings each. The default is the most the API
 * accepts (C8); another size can be given to see how latency follows it.
 */
const BULK_INSTANTS = Number(__ENV.BULK_INSTANTS || 285);
R.ingestBulk = `POST /api/readings (${BULK_INSTANTS * 7} readings)`;

/**
 * Share of the visits to a point that turn the forecast on. The switch is off by default
 * in the interface; half is a heavy guess, kept to measure the route under load.
 */
const FORECAST_SHARE = Number(__ENV.FORECAST_SHARE || 0.5);

const measured = { phase: 'measure' };

export const options = {
  scenarios: {
    warmup: {
      executor: 'constant-vus',
      exec: 'browse',
      vus: 2,
      duration: WARMUP,
      tags: { phase: 'warmup' },
    },
    operators: {
      executor: 'constant-vus',
      exec: 'browse',
      vus: 8,
      startTime: WARMUP,
      duration: MEASURE,
      tags: measured,
    },
    admin: {
      executor: 'constant-vus',
      exec: 'lifecycle',
      vus: 1,
      startTime: WARMUP,
      duration: MEASURE,
      tags: measured,
    },
    sensors: {
      executor: 'constant-arrival-rate',
      exec: 'ingest',
      rate: 2,
      timeUnit: '1s',
      preAllocatedVUs: 4,
      startTime: WARMUP,
      duration: MEASURE,
      tags: measured,
    },
    imports: {
      executor: 'constant-arrival-rate',
      exec: 'importCsv',
      rate: 1,
      timeUnit: '10s',
      preAllocatedVUs: 2,
      startTime: WARMUP,
      duration: MEASURE,
      tags: measured,
    },
    bulk: {
      executor: 'constant-arrival-rate',
      exec: 'ingestBulk',
      rate: 1,
      timeUnit: '15s',
      preAllocatedVUs: 2,
      startTime: WARMUP,
      duration: MEASURE,
      tags: measured,
    },
  },
  // One threshold per route: k6 then also reports each route's statistics.
  thresholds: {
    ...Object.fromEntries(
      Object.values(R).map((name) => [
        `http_req_duration{name:${name},phase:measure}`,
        [`p(99)<${LIMIT_MS}`],
      ]),
    ),
    'http_req_failed{phase:measure}': ['rate==0'],
    'checks{phase:measure}': ['rate==1'],
  },
  summaryTrendStats: ['count', 'med', 'p(95)', 'p(99)', 'max'],
  // k6 clears cookies at every iteration by default; each virtual user logs in once and
  // keeps its session, as a browser does.
  noCookiesReset: true,
};

const JSON_HEADERS = { 'Content-Type': 'application/json' };

function call(method, path, name, body, expected = 200) {
  const response = http.request(
    method,
    `${API}${path}`,
    body === undefined ? null : JSON.stringify(body),
    { headers: body === undefined ? {} : JSON_HEADERS, tags: { name } },
  );
  check(response, { [`${name} answers ${expected}`]: (r) => r.status === expected });
  return response;
}

function login() {
  call('POST', '/auth/login', R.login, { email: __ENV.EMAIL, password: __ENV.PASSWORD }, 204);
}

/** Logs in on the first iteration of each virtual user; k6 keeps its cookie after that. */
function ensureSession(state) {
  if (!state.loggedIn) {
    login();
    state.loggedIn = true;
  }
}

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const think = () => sleep(0.5 + Math.random());

export function setup() {
  login();
  const sensors = call('GET', '/sensors', R.sensors).json();
  const machines = call('GET', '/machines?pageSize=100', R.machines).json().items;
  const sector = call('GET', '/sectors', R.sectors)
    .json()
    .find((item) => item.code === 'DRY');
  return {
    // Codes of the records the admin flow creates, unique per run: a run stopped halfway
    // leaves records that must not collide with the next run's.
    run: Date.now().toString(36).slice(-5).toUpperCase(),
    sectorId: sector.id,
    machineIds: machines.map((machine) => machine.id),
    // Operators visit the points that receive no writes: their histories stay continuous
    // up to the latest reading, so their forecasts are real ones.
    pointIds: sensors
      .filter((sensor) => !WRITTEN.test(sensor.serialNumber))
      .map((sensor) => sensor.monitoringPointId),
    fullPointId: sensors.find((sensor) => sensor.serialNumber === FULL_SENSOR).monitoringPointId,
    writable: sensors
      .filter((sensor) => WRITTEN.test(sensor.serialNumber))
      .map((sensor) => sensor.serialNumber),
  };
}

const session = {};

const SORTS = [
  'machineName',
  'machineType',
  'monitoringPointName',
  'sensorModel',
  'machineTag',
  'location',
];

/** What an operator does: the screens of the interface, as the browser loads them. */
export function browse(data) {
  ensureSession(session);
  call('GET', '/auth/me', R.me);
  call('GET', '/health', R.health);
  call('GET', '/overview', R.overview);
  think();

  const sort = pick(SORTS);
  const order = pick(['asc', 'desc']);
  const page = 1 + Math.floor(Math.random() * 16);
  call('GET', `/monitoring-points?page=${page}&pageSize=5&sort=${sort}&order=${order}`, R.points);
  call(
    'GET',
    `/machines?page=${1 + Math.floor(Math.random() * 2)}&pageSize=10&sort=${pick(['tag', 'name', 'type', 'sector'])}&order=${order}`,
    R.machines,
  );
  call('GET', '/sectors', R.sectors);
  call('GET', `/machines/${pick(data.machineIds)}`, R.machine);
  think();

  // The point page: half the visits open the point with full series, the worst case.
  const pointId = Math.random() < 0.5 ? data.fullPointId : pick(data.pointIds);
  call('GET', `/monitoring-points/${pointId}`, R.point);
  const series = call('GET', `/monitoring-points/${pointId}/time-series`, R.series).json();
  const last = series.map((item) => item.lastTimestamp).sort()[series.length - 1];
  const range = pick([
    '',
    `from=${new Date(Date.parse(last) - 7 * 86_400_000).toISOString()}&to=${last}`,
  ]);
  const requests = series.flatMap((item) => [
    ['GET', `${API}/time-series/${item.id}/metrics?${range}`, null, { tags: { name: R.metrics } }],
    [
      'GET',
      `${API}/time-series/${item.id}/readings?${range}&maxPoints=1000`,
      null,
      { tags: { name: R.readings } },
    ],
  ]);
  // The browser asks for the 14 at once.
  for (const response of http.batch(requests)) {
    check(response, { 'point page data answers 200': (r) => r.status === 200 });
  }
  // A share of the visits turns the forecast on: one request per series, at once too.
  if (Math.random() < FORECAST_SHARE) {
    const forecasts = series.map((item) => [
      'GET',
      `${API}/time-series/${item.id}/forecast`,
      null,
      { tags: { name: R.forecast } },
    ]);
    for (const response of http.batch(forecasts)) {
      check(response, { 'forecast answers 200': (r) => r.status === 200 });
    }
  }
  call('GET', `/sensors?serialNumber=${pick(data.writable)}`, R.sensors);
  think();
}

/** What an administrator does, on records made for it and removed at the end. */
export function lifecycle(data) {
  ensureSession(session);
  const n = exec.scenario.iterationInTest;
  const code = `L${data.run}${n}`.slice(0, 10);
  const sector = call('POST', '/sectors', R.createSector, { code, name: `Load ${n}` }, 201).json();
  call('PATCH', `/sectors/${sector.id}`, R.updateSector, { name: `Load sector ${n}` });
  call('GET', `/machines/next-number?sectorId=${sector.id}&type=Fan`, R.nextNumber);
  const machine = call(
    'POST',
    '/machines',
    R.createMachine,
    {
      sectorId: sector.id,
      type: 'Fan',
      number: 1,
      name: `Load fan ${n}`,
    },
    201,
  ).json();
  const [first, second] = call(
    'POST',
    `/machines/${machine.id}/monitoring-points`,
    R.addPositions,
    {
      positions: [{ location: 'FAN_MOTOR_DE' }, { location: 'FAN_SHAFT_DE' }],
    },
    201,
  ).json().items;
  call('PATCH', `/monitoring-points/${first.id}`, R.updatePoint, { name: 'Motor' });
  const serialNumber = `LDX-${data.run}-${n}`;
  call('PUT', `/monitoring-points/${first.id}/sensor`, R.installSensor, {
    serialNumber,
    model: 'TcAs',
  });
  call('POST', '/readings', R.ingest, {
    readings: [
      {
        serialNumber,
        timestamp: '2026-09-29T10:00:00Z',
        quantity: 'temperature',
        axis: null,
        value: 40,
      },
    ],
  });
  const [series] = call('GET', `/monitoring-points/${first.id}/time-series`, R.series).json();
  call('DELETE', `/time-series/${series.id}`, R.deleteSeries, undefined, 204);
  call('DELETE', `/monitoring-points/${first.id}/sensor`, R.removeSensor, undefined, 204);
  call('DELETE', `/monitoring-points/${second.id}`, R.deletePoint, undefined, 204);
  call('PATCH', `/machines/${machine.id}`, R.updateMachine, { name: `Load fan ${n}, renamed` });
  call('DELETE', `/machines/${machine.id}`, R.deleteMachine, undefined, 204);
  call('DELETE', `/sectors/${sector.id}`, R.deleteSector, undefined, 204);
  call('POST', '/auth/logout', R.logout, undefined, 204);
  login();
  think();
}

const SERIES = [
  ['acceleration_rms', 'H'],
  ['acceleration_rms', 'V'],
  ['acceleration_rms', 'A'],
  ['velocity_rms', 'H'],
  ['velocity_rms', 'V'],
  ['velocity_rms', 'A'],
  ['temperature', null],
];
const MINUTE = 60_000;

/** Readings of one sensor at the given instants; every series, a value of 1. */
function readingsAt(serialNumber, instants) {
  return instants.flatMap((instant) =>
    SERIES.map(([quantity, axis]) => ({
      serialNumber,
      timestamp: new Date(instant).toISOString(),
      quantity,
      axis,
      value: 1,
    })),
  );
}

/**
 * Each writer uses instants of its own year, after the simulated history, and each
 * iteration new ones, so no submission repeats or conflicts with another. The runner
 * deletes these readings before a run: a reading sent again is only counted, which is
 * cheaper than storing it, and would make a second run look faster than it is.
 */
const YEAR = {
  ingest: Date.UTC(2027, 0, 1),
  importCsv: Date.UTC(2028, 0, 1),
  bulk: Date.UTC(2029, 0, 1),
};

/** A sensor's live submission: the 7 series at one instant, twice. */
export function ingest(data) {
  ensureSession(session);
  const n = exec.scenario.iterationInTest;
  const serialNumber = data.writable[n % data.writable.length];
  const round = Math.floor(n / data.writable.length);
  const instants = [YEAR.ingest + round * 20 * MINUTE, YEAR.ingest + (round * 20 + 10) * MINUTE];
  call('POST', '/readings', R.ingest, { readings: readingsAt(serialNumber, instants) });
}

/** A day of one sensor, 144 instants of 7 series, uploaded as a CSV file. */
export function importCsv(data) {
  ensureSession(session);
  const n = exec.scenario.iterationInTest;
  const serialNumber = data.writable[n % data.writable.length];
  const start = YEAR.importCsv + Math.floor(n / data.writable.length) * 1440 * MINUTE;
  const instants = Array.from({ length: 144 }, (_, index) => start + index * 10 * MINUTE);
  const lines = readingsAt(serialNumber, instants).map(
    (r) => `${r.serialNumber},${r.timestamp},${r.quantity},${r.axis ?? ''},${r.value}`,
  );
  const csv = ['serial_number,timestamp,quantity,axis,value', ...lines].join('\n');
  const response = http.post(
    `${API}/imports`,
    { file: http.file(csv, 'readings.csv', 'text/csv') },
    {
      tags: { name: R.importCsv },
    },
  );
  check(response, { [`${R.importCsv} answers 200`]: (r) => r.status === 200 });
}

/** The largest submission, on instants no other iteration uses. */
export function ingestBulk(data) {
  ensureSession(session);
  const n = exec.scenario.iterationInTest;
  const serialNumber = data.writable[n % data.writable.length];
  const start = YEAR.bulk + Math.floor(n / data.writable.length) * BULK_INSTANTS * 10 * MINUTE;
  const instants = Array.from({ length: BULK_INSTANTS }, (_, index) => start + index * 10 * MINUTE);
  call('POST', '/readings', R.ingestBulk, { readings: readingsAt(serialNumber, instants) });
}

/** One line per route: what was measured, and whether it passed. */
export function handleSummary(data) {
  const rows = Object.values(R).map((name) => {
    const metric = data.metrics[`http_req_duration{name:${name},phase:measure}`];
    const values = metric ? metric.values : {};
    const ms = (value) => (value === undefined ? 'n/a' : value.toFixed(0));
    const passed = metric && Object.values(metric.thresholds ?? {}).every((t) => t.ok);
    return `| ${name} | ${values.count ?? 0} | ${ms(values.med)} | ${ms(values['p(95)'])} | ${ms(values['p(99)'])} | ${ms(values.max)} | ${passed ? 'yes' : 'NO'} |`;
  });
  const failed = data.metrics['http_req_failed{phase:measure}']?.values.rate ?? 0;
  const table = [
    `Requests that failed: ${(failed * 100).toFixed(2)} %. Times in ms, measured phase only.`,
    '',
    '| Route | Requests | p50 | p95 | p99 | Max | p99 < 350 ms |',
    '|---|---|---|---|---|---|---|',
    ...rows,
    '',
  ].join('\n');
  return {
    stdout: `\n${table}\n`,
    '/scripts/results/latency.md': table,
    '/scripts/results/summary.json': JSON.stringify(data, null, 2),
  };
}
