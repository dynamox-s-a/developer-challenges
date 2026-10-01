import { MAX_READINGS_PER_SERIES } from '@condition-monitor/shared';

const MINUTE = 60_000;

/**
 * The latest instant of the grid at or before `now`. Instants are multiples of the
 * interval since the epoch (10:00, 10:10, 10:20 at 10 minutes), so two runs choose the
 * same instants and their readings coincide instead of interleaving.
 */
export function latestGridTime(now: number, intervalMinutes: number): number {
  const interval = intervalMinutes * MINUTE;
  return Math.floor(now / interval) * interval;
}

/** How many instants a backfill of these days holds per series. */
export function backfillCount(days: number, intervalMinutes: number): number {
  return Math.floor((days * 1440) / intervalMinutes);
}

/** The largest backfill a series accepts at this interval (C8). */
export function maxBackfillDays(intervalMinutes: number): number {
  return Math.floor((MAX_READINGS_PER_SERIES * intervalMinutes) / 1440);
}

/** The instants of a backfill, oldest first, ending at the latest grid instant. */
export function backfillTimes(now: number, days: number, intervalMinutes: number): number[] {
  const end = latestGridTime(now, intervalMinutes);
  const count = backfillCount(days, intervalMinutes);
  return Array.from(
    { length: count },
    (_, index) => end - (count - 1 - index) * intervalMinutes * MINUTE,
  );
}
