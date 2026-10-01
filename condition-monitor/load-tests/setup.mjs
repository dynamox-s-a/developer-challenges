// Builds the plant the load test measures (assumption D1): a fresh database, the seed
// user, 20 machines with 4 monitoring points each, a sensor on every point, 30 days of
// telemetry for all of them and the longest history a series holds for one of them.
// Usage, from the workspace root: npm run load:setup
import { LOAD_API, LOAD_DATABASE, log, login, psql, run, startApi, stopApi } from './lib.mjs';

const PUMP_POSITIONS = [
  'PUMP_MOTOR_NDE',
  'PUMP_MOTOR_DE',
  'PUMP_COUPLING_SIDE',
  'PUMP_IMPELLER_SIDE',
];
const FAN_POSITIONS = ['FAN_MOTOR_NDE', 'FAN_MOTOR_DE', 'FAN_SHAFT_DE', 'FAN_SHAFT_NDE'];
const FAN_MODELS = ['TcAg', 'TcAs', 'HF+'];
const MACHINES_PER_TYPE = 10;
const DAYS = 30;
/** The longest backfill at 10 minutes: 49,968 readings per series, below 50,000 (C8). */
const FULL_DAYS = 347;
const FULL_SENSOR = 'LD-0001';

const started = Date.now();
const seconds = () => ((Date.now() - started) / 1000).toFixed(0);

log(`Recreating the database ${LOAD_DATABASE}.`);
psql(`DROP DATABASE IF EXISTS ${LOAD_DATABASE} WITH (FORCE)`);
psql(`CREATE DATABASE ${LOAD_DATABASE}`);

log('Building the API and the simulator for production.');
run('npx', [
  'nx',
  'run-many',
  '-t',
  'build',
  '-p',
  'api',
  'simulator',
  '--configuration=production',
]);
run('npx', ['prisma', 'migrate', 'deploy'], { cwd: 'apps/api' });
run('node', ['dist/seed.js'], { cwd: 'apps/api' });

const api = await startApi();
try {
  const request = await login();
  const [sector] = await request('GET', '/sectors');
  log(`Creating ${MACHINES_PER_TYPE * 2} machines in sector ${sector.code}.`);
  let serial = 0;
  for (const type of ['Pump', 'Fan']) {
    for (let number = 1; number <= MACHINES_PER_TYPE; number += 1) {
      const machine = await request('POST', '/machines', {
        sectorId: sector.id,
        type,
        number,
        name: type === 'Pump' ? `Condensate pump ${number}` : `Hood exhaust fan ${number}`,
      });
      const positions = (type === 'Pump' ? PUMP_POSITIONS : FAN_POSITIONS).map((location) => ({
        location,
      }));
      const { items } = await request('POST', `/machines/${machine.id}/monitoring-points`, {
        positions,
      });
      for (const point of items) {
        serial += 1;
        await request('PUT', `/monitoring-points/${point.id}/sensor`, {
          serialNumber: `LD-${String(serial).padStart(4, '0')}`,
          model: type === 'Pump' ? 'HF+' : FAN_MODELS[serial % FAN_MODELS.length],
        });
      }
    }
  }
  log(`${serial} sensors installed.`);

  const simulator = (args) =>
    run('node', ['apps/simulator/dist/main.js', 'backfill', '--api-url', LOAD_API, ...args], {
      env: {
        ...process.env,
        SIMULATOR_EMAIL: process.env.SEED_USER_EMAIL,
        SIMULATOR_PASSWORD: process.env.SEED_USER_PASSWORD,
      },
    });
  log(`Backfill of ${FULL_DAYS} days for ${FULL_SENSOR}, the longest a series holds.`);
  simulator(['--days', String(FULL_DAYS), '--serial', FULL_SENSOR]);
  log(`Backfill of ${DAYS} days for every sensor.`);
  simulator(['--days', String(DAYS)]);

  const overview = await request('GET', '/overview');
  log(`Ready in ${seconds()} s: ${JSON.stringify(overview)}`);
} finally {
  await stopApi(api);
}
