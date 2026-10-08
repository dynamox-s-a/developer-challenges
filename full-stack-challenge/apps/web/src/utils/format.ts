const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

/** An ISO timestamp in the viewer's locale and time zone. */
export function formatDateTime(iso: string): string {
  return dateTimeFormat.format(new Date(iso));
}

/** "1 monitoring point", "2,500 readings" (count grouped by locale). */
export function pluralize(count: number, singular: string, plural?: string) {
  const noun = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${formatNumber(count)} ${noun}`;
}

const numberFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 3,
});

/** A reading value: grouped, at most 3 decimals. */
export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

const DAY_MS = 86_400_000;
const timeOnly = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' });
const dateAndTime = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});
const dateOnly = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

/**
 * A formatter for time-axis ticks, as precise as the visible span needs:
 * hours within a day, date and hour within a week, the date beyond.
 */
export function axisTimeFormatter(spanMs: number): (epochMs: number) => string {
  let format = dateOnly;
  if (spanMs <= DAY_MS) format = timeOnly;
  else if (spanMs <= 7 * DAY_MS) format = dateAndTime;
  return (epochMs) => format.format(new Date(epochMs));
}

const pad = (n: number) => String(n).padStart(2, '0');

/** An ISO instant as a `datetime-local` input value, in local time. */
export function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

/**
 * A `datetime-local` value (minute precision, local time) as an ISO instant.
 * `endOfMinute` makes an inclusive upper bound cover the whole minute, so
 * "to 12:05" keeps a reading taken at 12:05:30.
 */
export function fromLocalInputValue(
  value: string,
  endOfMinute = false,
): string {
  const date = new Date(value);
  if (endOfMinute) date.setSeconds(59, 999);
  return date.toISOString();
}
