import { parseArgs } from 'node:util';
import { MAX_READINGS_PER_SERIES } from '@condition-monitor/shared';
import { backfillCount, maxBackfillDays } from '../telemetry/grid';

/**
 * Commands of the simulator (assumption C13): `backfill` sends a history and exits,
 * `live` sends current readings at a fixed interval, like a real sensor.
 */
export type BackfillCommand = { name: 'backfill'; days: number } & CommonOptions;
export type LiveCommand = { name: 'live' } & CommonOptions;
export type Command = { name: 'help' } | BackfillCommand | LiveCommand;

export interface CommonOptions {
  apiUrl: string;
  intervalMinutes: number;
  seed: number;
  /** Empty means every installed sensor, discovered through the API. */
  serialNumbers: string[];
  /** Sensors whose levels rise from an instant on, or null when none degrades. */
  degrade: Degradation | null;
}

export interface Degradation {
  serialNumbers: string[];
  /** Milliseconds since the epoch: before it, the sensor behaves like the others. */
  since: number;
}

/** A command line that cannot run; the message says what to fix. */
export class UsageError extends Error {
  override readonly name = 'UsageError';
}

export const DEFAULTS = {
  apiUrl: 'http://localhost:3000/api',
  intervalMinutes: 10,
  seed: 1,
  days: 30,
} as const;

export function parseCommand(argv: string[]): Command {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    strict: false,
    options: {
      help: { type: 'boolean', short: 'h' },
      serial: { type: 'string', multiple: true },
      interval: { type: 'string' },
      seed: { type: 'string' },
      days: { type: 'string' },
      'api-url': { type: 'string' },
      degrade: { type: 'string', multiple: true },
      'degrade-since': { type: 'string' },
    },
  });

  const [name, ...extra] = positionals;
  if (values.help || name === undefined || name === 'help') {
    return { name: 'help' };
  }
  // Unknown options first: the value after an unknown flag is read as a stray argument,
  // and naming that value would hide the real mistake.
  const known = new Set([
    'help',
    'serial',
    'interval',
    'seed',
    'days',
    'api-url',
    'degrade',
    'degrade-since',
  ]);
  const unknown = Object.keys(values).find((key) => !known.has(key));
  if (unknown) {
    throw new UsageError(`Unknown option: --${unknown}`);
  }
  if (extra.length > 0) {
    throw new UsageError(`Unexpected argument: ${extra[0]}`);
  }

  const common: CommonOptions = {
    apiUrl: stringOption(values['api-url'], DEFAULTS.apiUrl),
    intervalMinutes: integerOption('interval', values.interval, DEFAULTS.intervalMinutes, 1, 1440),
    seed: integerOption('seed', values.seed, DEFAULTS.seed, 0, Number.MAX_SAFE_INTEGER),
    serialNumbers: stringList('serial', values.serial),
    degrade: degradation(values.degrade, values['degrade-since']),
  };

  if (name === 'backfill') {
    // A series holds at most 50,000 readings (C8): the longest history depends on the
    // interval, 347 days at 10 minutes. A longer one would be refused by the API.
    const maxDays = maxBackfillDays(common.intervalMinutes);
    const asked =
      typeof values.days === 'string' && /^\d+$/.test(values.days) ? Number(values.days) : 0;
    if (asked > maxDays) {
      throw new UsageError(
        `--days ${asked} at a ${common.intervalMinutes}-minute interval gives ${backfillCount(asked, common.intervalMinutes).toLocaleString('en-US')} readings per series, above the limit of ${MAX_READINGS_PER_SERIES.toLocaleString('en-US')}: at most ${maxDays} days.`,
      );
    }
    const days = integerOption('days', values.days, DEFAULTS.days, 1, maxDays);
    return { name, days, ...common };
  }
  if (name === 'live') {
    if (values.days !== undefined) {
      throw new UsageError('--days applies only to backfill.');
    }
    return { name, ...common };
  }
  throw new UsageError(`Unknown command: ${name}`);
}

function stringOption(value: unknown, fallback: string): string {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || value === '') {
    throw new UsageError('--api-url needs a value.');
  }
  return value;
}

function stringList(flag: string, value: unknown): string[] {
  if (value === undefined) return [];
  const list = (Array.isArray(value) ? value : [value]).map(String);
  if (list.some((item) => item === '' || item === 'true')) {
    throw new UsageError(`--${flag} needs a serial number.`);
  }
  return list;
}

/**
 * The start is given, never taken from the run: a backfill made on another day must
 * produce the same value for the same instant, or the API would refuse it as a conflict.
 */
function degradation(serials: unknown, since: unknown): Degradation | null {
  const serialNumbers = stringList('degrade', serials).map((serial) => serial.trim().toUpperCase());
  if (serialNumbers.length === 0) {
    if (since !== undefined) throw new UsageError('--degrade-since applies only with --degrade.');
    return null;
  }
  const start =
    typeof since === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(since)
      ? Date.parse(`${since}T00:00:00Z`)
      : NaN;
  if (Number.isNaN(start)) {
    throw new UsageError('--degrade needs --degrade-since <YYYY-MM-DD>, the day it starts (UTC).');
  }
  return { serialNumbers, since: start };
}

function integerOption(
  flag: string,
  value: unknown,
  fallback: number,
  min: number,
  max: number,
): number {
  if (value === undefined) return fallback;
  const parsed = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : NaN;
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    throw new UsageError(`--${flag} must be an integer from ${min} to ${max}.`);
  }
  return parsed;
}
