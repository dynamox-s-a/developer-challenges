import type { IngestionReport, Reading, SensorInstallation } from '@condition-monitor/shared';

export const API_URL = 'http://api.test/api';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': status < 400 ? 'application/json' : 'application/problem+json' },
  });

/**
 * An in-memory stand-in for the API routes the simulator uses. Readings follow the real
 * rule: a repeated instant is counted, not stored twice (C5).
 */
export function fakeApi(installed: SensorInstallation[]) {
  const stored = new Map<string, number>();
  const series = new Set<string>();
  const submissions: Reading[][] = [];
  const state = {
    logins: 0,
    session: '',
    /** The next readings requests that answer this status instead. */
    failures: [] as number[],
    reachable: true,
  };

  const fetch = async (input: string | URL | Request, init?: RequestInit) => {
    if (!state.reachable) throw new TypeError('fetch failed');
    const url = new URL(String(input));
    const path = url.pathname.replace('/api', '');
    const cookie = new Headers(init?.headers).get('Cookie');

    if (path === '/auth/login') {
      const body = JSON.parse(String(init?.body)) as { password: string };
      if (body.password !== 'secret') return json({ detail: 'Wrong email or password.' }, 401);
      state.logins += 1;
      state.session = `session=token-${state.logins}`;
      return new Response(null, {
        status: 204,
        headers: { 'Set-Cookie': `${state.session}; Path=/api; HttpOnly` },
      });
    }
    if (cookie !== state.session) return json({ detail: 'Authentication required.' }, 401);

    if (path === '/sensors') {
      const asked = url.searchParams.getAll('serialNumber').map((serial) => serial.toUpperCase());
      return json(
        installed.filter((sensor) => asked.length === 0 || asked.includes(sensor.serialNumber)),
      );
    }
    if (path === '/readings') {
      const failure = state.failures.shift();
      if (failure) return json({ detail: 'Refused for the test.', errors: [] }, failure);
      const { readings } = JSON.parse(String(init?.body)) as { readings: Reading[] };
      submissions.push(readings);
      const report: IngestionReport = {
        sensors: [],
        totals: { seriesCreated: 0, readingsInserted: 0, readingsRepeated: 0 },
      };
      for (const reading of readings) {
        const key = `${reading.serialNumber}|${reading.quantity}|${reading.axis ?? ''}`;
        if (!series.has(key)) {
          series.add(key);
          report.totals.seriesCreated += 1;
        }
        const instant = `${key}|${reading.timestamp}`;
        if (stored.get(instant) === reading.value) {
          report.totals.readingsRepeated += 1;
        } else if (stored.has(instant)) {
          return json({ detail: `Conflict at ${instant}.` }, 422);
        } else {
          stored.set(instant, reading.value);
          report.totals.readingsInserted += 1;
        }
      }
      return json(report);
    }
    return json({ detail: 'Not found.' }, 404);
  };

  return { fetch: fetch as typeof globalThis.fetch, state, stored, submissions };
}

export const fan: SensorInstallation = {
  serialNumber: 'DX-0001',
  model: 'TcAg',
  monitoringPointId: 'p1',
  location: 'FAN_MOTOR_DE',
  machineTag: 'DRY-FAN-01',
  machineType: 'Fan',
};

export const pump: SensorInstallation = {
  serialNumber: 'DX-0002',
  model: 'HF+',
  monitoringPointId: 'p2',
  location: 'PUMP_MOTOR_DE',
  machineTag: 'DRY-PUMP-01',
  machineType: 'Pump',
};

/** Collects what a command writes, split as it would go to stdout and stderr. */
export function captureOutput() {
  const info: string[] = [];
  const error: string[] = [];
  return {
    out: { info: (line: string) => info.push(line), error: (line: string) => error.push(line) },
    info,
    error,
  };
}
