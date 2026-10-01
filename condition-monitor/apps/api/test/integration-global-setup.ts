import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { loadEnvFile } from '../src/config/load-env-file';

/**
 * Runs once before the integration tests: brings the test database to the latest
 * migration, so tests always run against the schema the application ships with.
 */
export default function globalSetup(): void {
  loadEnvFile(join(__dirname, '../../../.env'));
  const testUrl = process.env.DATABASE_URL_TEST;
  if (!testUrl) {
    throw new Error('DATABASE_URL_TEST is not set. Copy .env.example to .env or set it.');
  }
  execSync('npx prisma migrate deploy', {
    cwd: join(__dirname, '..'),
    env: { ...process.env, DATABASE_URL: testUrl },
    stdio: 'inherit',
  });
}
