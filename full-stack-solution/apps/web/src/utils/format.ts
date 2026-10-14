/** Formatting helpers shared by the tables, cards and charts. */

/** `2026-10-10T12:30:00Z` -> `10/10/2026, 12:30:00` (viewer's locale). */
export function formatTimestamp(iso: string | null): string {
  if (!iso) {
    return "—";
  }

  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Picks the tick format for a time axis from the span it covers.
 *
 * A fixed format cannot serve both ends: showing only the time of day turns a
 * three-month series into a column of meaningless repeated clock readings,
 * while showing full dates on a ten-minute window repeats the same date on
 * every tick. The thresholds below are the points at which the coarser unit
 * starts carrying the information.
 *
 * `spanMs` is the distance between the first and the last sample on the axis.
 */
export function formatAxisTimestamp(timestamp: number, spanMs: number): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  if (spanMs < 2 * MINUTE) {
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  if (spanMs < 2 * DAY) {
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (spanMs < 180 * DAY) {
    return date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
    });
  }

  if (spanMs < 3 * 365 * DAY) {
    return date.toLocaleDateString(undefined, {
      month: "short",
      year: "numeric",
    });
  }

  return date.toLocaleDateString(undefined, { year: "numeric" });
}

/** Rounds to at most `fractionDigits` and renders `—` for missing values. */
export function formatNumber(
  value: number | null | undefined,
  fractionDigits = 2,
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return value.toLocaleString(undefined, {
    maximumFractionDigits: fractionDigits,
  });
}
