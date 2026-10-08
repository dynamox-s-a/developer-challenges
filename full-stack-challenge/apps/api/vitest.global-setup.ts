import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const TEST_DATABASE_URL =
  process.env['TEST_DATABASE_URL'] ??
  'postgresql://dynapredict:dynapredict@localhost:5433/dynapredict_test';

/** Brings the test database schema up to date once, before any test file runs. */
export default function setup() {
  execSync('npx prisma migrate deploy', {
    cwd: resolve(import.meta.dirname, '../..'),
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
    stdio: 'pipe',
  });
}
