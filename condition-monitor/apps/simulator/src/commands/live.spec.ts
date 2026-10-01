import { ApiClient } from '../api/client';
import { DEFAULTS, type LiveCommand } from '../cli/parse-args';
import { API_URL, captureOutput, fakeApi, fan, pump } from '../testing/fake-api';
import { live, type Clock } from './live';

const START = Date.UTC(2026, 8, 29, 10, 17);

function command(overrides: Partial<LiveCommand> = {}): LiveCommand {
  return {
    name: 'live',
    apiUrl: API_URL,
    intervalMinutes: DEFAULTS.intervalMinutes,
    seed: 1,
    serialNumbers: [],
    degrade: null,
    ...overrides,
  };
}

/** A clock that jumps ahead when slept on, and stops the run after some sleeps. */
function fakeClock(stopAfterSleeps: number, stop: AbortController) {
  let now = START;
  const sleeps: number[] = [];
  const clock: Clock = {
    now: () => now,
    sleep: async (ms) => {
      sleeps.push(ms);
      now += ms;
      if (sleeps.length >= stopAfterSleeps) stop.abort();
    },
  };
  return { clock, sleeps };
}

function setup(sensors = [fan, pump]) {
  const api = fakeApi(sensors);
  const client = new ApiClient({
    apiUrl: API_URL,
    email: 'op@test',
    password: 'secret',
    fetch: api.fetch,
  });
  return { api, client, ...captureOutput() };
}

describe('live', () => {
  it('sends every series at each grid instant, sleeping until the next one', async () => {
    const { api, client, out, info } = setup();
    const stop = new AbortController();
    const { clock, sleeps } = fakeClock(2, stop);

    const code = await live(command(), { client, clock, out, signal: stop.signal });

    expect(code).toBe(0);
    expect(api.submissions.map((batch) => batch.length)).toEqual([14, 14]);
    expect(api.submissions.map((batch) => batch[0].timestamp)).toEqual([
      '2026-09-29T10:10:00.000Z',
      '2026-09-29T10:20:00.000Z',
    ]);
    // From 10:17 to 10:20, then a whole interval.
    expect(sleeps).toEqual([180_000, 600_000]);
    expect(info.at(-1)).toBe('Stopped.');
  });

  it('reports a failed instant and carries on at the next one', async () => {
    const { api, client, out, error, info } = setup();
    api.state.failures.push(503);
    const stop = new AbortController();
    const { clock } = fakeClock(2, stop);

    await live(command(), { client, clock, out, signal: stop.signal });

    expect(error[0]).toMatch(/^2026-09-29T10:10:00.000Z: Refused for the test\. Retrying/);
    expect(info.some((line) => line.startsWith('2026-09-29T10:20:00.000Z: 14 stored'))).toBe(true);
  });

  it('says at each instant that nothing was sent while no sensor is installed', async () => {
    const { client, out, error } = setup([]);
    const stop = new AbortController();
    const { clock } = fakeClock(2, stop);

    expect(await live(command(), { client, clock, out, signal: stop.signal })).toBe(0);
    expect(error).toEqual([
      '2026-09-29T10:10:00.000Z: no installed sensor, nothing sent.',
      '2026-09-29T10:20:00.000Z: no installed sensor, nothing sent.',
    ]);
  });

  it('refuses to start with a serial number that is not installed', async () => {
    const { api, client, out, error } = setup();
    const stop = new AbortController();
    const { clock } = fakeClock(1, stop);

    const code = await live(command({ serialNumbers: ['DX-7777'] }), {
      client,
      clock,
      out,
      signal: stop.signal,
    });

    expect(code).toBe(1);
    expect(error).toEqual(['Not installed at a monitoring point of this account: DX-7777.']);
    expect(api.submissions).toHaveLength(0);
  });
});
