import { existsSync } from 'node:fs';

/**
 * Loads `KEY=value` pairs from a `.env` file into `process.env` when the file exists, with
 * Node's native loader. Variables already set in the environment take precedence, so a
 * deployment's own configuration is never overridden by a file left on disk.
 */
export function loadEnvFile(path: string): void {
  if (existsSync(path)) {
    process.loadEnvFile(path);
  }
}
