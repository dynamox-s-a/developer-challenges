// Measures the latency of every API route under load (assumption D1), against the
// plant built by `npm run load:setup`. Usage, from the workspace root: npm run load:test
// k6 runs from its official image, so nothing is installed on the machine.
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { userInfo } from 'node:os';
import { LOAD_API, LOAD_DATABASE, log, psql, run, startApi, stopApi } from './lib.mjs';

/** Pinned, so a measurement can be repeated with the same tool. */
const K6_IMAGE = 'grafana/k6:2.3.0';

const scripts = resolve('load-tests');
mkdirSync(resolve(scripts, 'results'), { recursive: true });

// Every run starts from the same data. The simulated history ends in 2026; what earlier
// runs wrote is later than that. Left in place, the same readings sent again would only
// be counted as repeated, and the run would measure that instead of storing them.
log('Removing the readings written by earlier runs.');
psql("DELETE FROM readings WHERE timestamp >= '2027-01-01'", LOAD_DATABASE);

log('Building the API for production.');
run('npx', ['nx', 'run', 'api:build', '--configuration=production']);
const api = await startApi();
let code = 1;
try {
  log(`Running ${K6_IMAGE} against ${LOAD_API}.`);
  const { uid, gid } = userInfo();
  const result = spawnSync(
    'docker',
    [
      'run',
      '--rm',
      '--network',
      'host',
      // Results belong to the user, not to root.
      '--user',
      `${uid}:${gid}`,
      '-v',
      `${scripts}:/scripts`,
      '-e',
      `API_URL=${LOAD_API}`,
      '-e',
      `EMAIL=${process.env.SEED_USER_EMAIL}`,
      '-e',
      `PASSWORD=${process.env.SEED_USER_PASSWORD}`,
      '-e',
      `BULK_INSTANTS=${process.env.BULK_INSTANTS ?? ''}`,
      '-e',
      `FORECAST_SHARE=${process.env.FORECAST_SHARE ?? ''}`,
      K6_IMAGE,
      'run',
      '--quiet',
      '/scripts/latency.js',
    ],
    { stdio: 'inherit' },
  );
  // k6 exits with 99 when a threshold fails: some route is above the limit.
  code = result.status ?? 1;
  log(
    code === 0 ? 'Every route within the limit.' : `k6 exited with ${code}: see the table above.`,
  );
} finally {
  await stopApi(api);
}
process.exitCode = code;
