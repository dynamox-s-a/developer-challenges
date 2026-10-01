import { join } from 'node:path';
import { loadEnvFile } from '../src/config/load-env-file';

// Integration tests run against the dedicated test database, never the development one
// (ADR 0010). The API reads DATABASE_URL, so it is pointed at DATABASE_URL_TEST here.
loadEnvFile(join(__dirname, '../../../.env'));

const testUrl = process.env.DATABASE_URL_TEST;
if (!testUrl) {
  throw new Error('DATABASE_URL_TEST is not set. Copy .env.example to .env or set it.');
}
process.env.DATABASE_URL = testUrl;

// Tests sign their own sessions; a fixed secret keeps them independent of .env.
process.env.JWT_SECRET = 'integration-test-secret-of-at-least-32-chars';
