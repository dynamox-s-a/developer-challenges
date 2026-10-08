import type { ReadingInput } from '@dynapredict/shared-types';

/** At most this many problems are listed; the rest are only counted. */
export const MAX_REPORTED_ERRORS = 5;

export interface ParsedReadings {
  readings: ReadingInput[];
  /** One message per invalid entry, up to MAX_REPORTED_ERRORS. */
  errors: string[];
  invalidCount: number;
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * An instant as the API wants it (ISO 8601 with offset). Epoch milliseconds
 * and strings with an offset are absolute; a date-time without one is read
 * in the user's time zone, which is what a spreadsheet export means.
 */
export function normalizeTimestamp(raw: unknown): string | null {
  let date: Date;
  if (typeof raw === 'number') {
    date = new Date(raw);
  } else if (typeof raw === 'string' && raw.trim() !== '') {
    let text = raw.trim().replace(' ', 'T');
    // A date-time without offset is local for Date; a bare date would be
    // UTC, so give it a local midnight to keep the same reading.
    if (DATE_ONLY.test(text)) text = `${text}T00:00`;
    date = new Date(text);
  } else {
    return null;
  }
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parseValue(raw: unknown, decimalComma: boolean): number | null {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  if (typeof raw !== 'string' || raw.trim() === '') return null;
  const text = decimalComma ? raw.trim().replace(',', '.') : raw.trim();
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

class Collector {
  readonly readings: ReadingInput[] = [];
  readonly errors: string[] = [];
  invalidCount = 0;

  add(where: string, timestamp: unknown, value: unknown, decimalComma = false) {
    const iso = normalizeTimestamp(timestamp);
    const number = parseValue(value, decimalComma);
    if (iso && number !== null) {
      this.readings.push({ timestamp: iso, value: number });
      return;
    }
    const problem = iso
      ? `invalid value "${String(value)}"`
      : `invalid timestamp "${String(timestamp)}"`;
    this.fail(`${where}: ${problem}`);
  }

  fail(message: string) {
    this.invalidCount += 1;
    if (this.errors.length < MAX_REPORTED_ERRORS) this.errors.push(message);
  }

  result(): ParsedReadings {
    if (this.readings.length === 0 && this.invalidCount === 0) {
      this.fail('The file has no readings');
    }
    return {
      readings: this.readings,
      errors: this.errors,
      invalidCount: this.invalidCount,
    };
  }
}

/** `[{timestamp, value}]` or `{ "readings": [...] }`. */
function parseJson(text: string): ParsedReadings {
  const collector = new Collector();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    collector.fail('The file is not valid JSON');
    return collector.result();
  }
  const items = Array.isArray(data)
    ? data
    : (data as { readings?: unknown } | null)?.readings;
  if (!Array.isArray(items)) {
    collector.fail(
      'Expected an array of {"timestamp", "value"} or {"readings": [...]}',
    );
    return collector.result();
  }
  items.forEach((item: unknown, index) => {
    const entry = (item ?? {}) as { timestamp?: unknown; value?: unknown };
    collector.add(`Item ${index + 1}`, entry.timestamp, entry.value);
  });
  return collector.result();
}

/**
 * Two columns, timestamp then value, comma- or semicolon-separated. A
 * header row is optional. With semicolons, a decimal comma is accepted
 * (spreadsheets in pt-BR export "12,5").
 */
function parseCsv(text: string): ParsedReadings {
  const collector = new Collector();
  const lines = text.split(/\r?\n/);
  const firstLine = lines.find((line) => line.trim() !== '') ?? '';
  const delimiter = firstLine.includes(';') ? ';' : ',';
  const decimalComma = delimiter === ';';

  let columns = { timestamp: 0, value: 1 };
  let headerSeen = false;
  lines.forEach((line, index) => {
    if (line.trim() === '') return;
    const cells = line.split(delimiter).map((cell) => cell.trim());
    if (!headerSeen) {
      headerSeen = true;
      const lower = cells.map((cell) => cell.toLowerCase());
      if (lower.includes('timestamp') || lower.includes('value')) {
        columns = {
          timestamp: Math.max(0, lower.indexOf('timestamp')),
          value: Math.max(0, lower.indexOf('value')),
        };
        return;
      }
    }
    collector.add(
      `Line ${index + 1}`,
      cells[columns.timestamp],
      cells[columns.value],
      decimalComma,
    );
  });
  return collector.result();
}

/** Reads an uploaded file's text as readings, by extension or content. */
export function parseReadingsFile(
  fileName: string,
  text: string,
): ParsedReadings {
  const trimmed = text.trimStart();
  const looksJson =
    fileName.toLowerCase().endsWith('.json') ||
    trimmed.startsWith('[') ||
    trimmed.startsWith('{');
  return looksJson ? parseJson(text) : parseCsv(text);
}
