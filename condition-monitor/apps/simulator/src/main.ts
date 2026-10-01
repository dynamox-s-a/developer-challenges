import { existsSync } from 'node:fs';
import { setTimeout as wait } from 'node:timers/promises';
import { ApiClient } from './api/client';
import { parseCommand, UsageError } from './cli/parse-args';
import { USAGE } from './cli/usage';
import { backfill } from './commands/backfill';
import { live } from './commands/live';
import type { Output } from './commands/shared';

const out: Output = {
  info: (line) => process.stdout.write(`${line}\n`),
  error: (line) => process.stderr.write(`${line}\n`),
};

/**
 * Entry point of the simulator (C13). Exit codes: 0 when it did its job, 1 when it could
 * not (API unreachable, login refused, no sensor), 2 when the command line is wrong.
 */
async function main(argv: string[]): Promise<number> {
  let command;
  try {
    command = parseCommand(argv);
  } catch (error) {
    if (error instanceof UsageError) {
      process.stderr.write(`${error.message}\n\n${USAGE}`);
      return 2;
    }
    throw error;
  }
  if (command.name === 'help') {
    process.stdout.write(USAGE);
    return 0;
  }

  // The workspace keeps its settings in .env at its root, where npm runs the simulator.
  if (existsSync('.env')) process.loadEnvFile('.env');
  const email = process.env['SIMULATOR_EMAIL'];
  const password = process.env['SIMULATOR_PASSWORD'];
  if (!email || !password) {
    // Read from the environment, never from the command line, which shell history keeps.
    out.error('Set SIMULATOR_EMAIL and SIMULATOR_PASSWORD, as in .env.example.');
    return 1;
  }
  const client = new ApiClient({ apiUrl: command.apiUrl, email, password });

  if (command.name === 'backfill') {
    return backfill(command, { client, now: Date.now(), out });
  }
  const stop = new AbortController();
  process.once('SIGINT', () => stop.abort());
  process.once('SIGTERM', () => stop.abort());
  return live(command, {
    client,
    out,
    signal: stop.signal,
    clock: {
      now: () => Date.now(),
      sleep: (ms, signal) => wait(Math.max(0, ms), undefined, { signal }).catch(() => undefined),
    },
  });
}

void main(process.argv.slice(2)).then((code) => {
  process.exitCode = code;
});
