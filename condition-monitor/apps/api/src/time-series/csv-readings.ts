import {
  MAX_READINGS_PER_SUBMISSION,
  readingSchema,
  type Reading,
} from '@condition-monitor/shared';
import { CsvError, parse } from 'csv-parse/sync';

/** The columns of assumption C11, matched by name in any order. */
export const CSV_COLUMNS = ['serial_number', 'timestamp', 'quantity', 'axis', 'value'] as const;

type CsvColumn = (typeof CSV_COLUMNS)[number];

const FIELD_OF_COLUMN: Record<string, CsvColumn> = {
  serialNumber: 'serial_number',
  timestamp: 'timestamp',
  quantity: 'quantity',
  axis: 'axis',
  value: 'value',
};

/** A reading field named as the CSV column that holds it. */
export function csvField(name: string): string {
  return FIELD_OF_COLUMN[name] ?? (name === 'readings' ? 'file' : name);
}

/** A plain decimal with a dot, optionally in exponent form: no thousands separators. */
const DECIMAL = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

export type CsvLineError = {
  line: number;
  field: string;
  message: string;
};

export type CsvResult =
  | { ok: true; readings: Reading[]; lines: number[] }
  /** The file as a whole cannot be read, so no line can be judged. */
  | { ok: false; fileError: string }
  | { ok: false; lineErrors: CsvLineError[]; invalidLines: number };

/**
 * Reads a CSV file of readings (assumptions C11, C12): UTF-8 with a header, comma as
 * separator and dot as decimal mark, timestamps with an offset. Every line is checked,
 * so the answer lists every problem at once rather than the first one.
 */
export function readCsv(file: Buffer): CsvResult {
  let text: string;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(file);
  } catch {
    return { ok: false, fileError: 'The file is not UTF-8 text. Save it as CSV UTF-8.' };
  }

  let records: { record: string[]; info: { lines: number } }[];
  try {
    // With `info: true` each record comes with its line; the typings do not model it.
    records = parse(text, {
      bom: true,
      info: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
    }) as unknown as typeof records;
  } catch (error) {
    if (error instanceof CsvError) {
      const line = (error as CsvError & { lines?: number }).lines;
      return {
        ok: false,
        fileError: `The file is not valid CSV${line ? ` at line ${line}` : ''}: ${error.message}`,
      };
    }
    throw error;
  }

  const [header, ...rows] = records;
  if (!header) return { ok: false, fileError: 'The file is empty.' };

  const columns = header.record.map((name) => name.toLowerCase());
  if (columns.length === 1 && columns[0].includes(';')) {
    // A spreadsheet in a Portuguese locale saves semicolons and decimal commas; reading
    // it as commas would produce wrong values, so it is refused with the reason.
    return {
      ok: false,
      fileError:
        'The columns are separated by semicolons. Save the file with commas as separator and dots as decimal mark.',
    };
  }
  const headerProblem = checkHeader(columns);
  if (headerProblem) return { ok: false, fileError: headerProblem };
  if (rows.length === 0) return { ok: false, fileError: 'The file has a header but no readings.' };
  if (rows.length > MAX_READINGS_PER_SUBMISSION) {
    return {
      ok: false,
      fileError: `The file has ${rows.length.toLocaleString('en-US')} readings; at most ${MAX_READINGS_PER_SUBMISSION.toLocaleString('en-US')} are accepted per file.`,
    };
  }

  const position = new Map(columns.map((name, index) => [name as CsvColumn, index]));
  const readings: Reading[] = [];
  const lines: number[] = [];
  const lineErrors: CsvLineError[] = [];
  for (const { record, info } of rows) {
    const line = info.lines;
    if (record.length !== columns.length) {
      const hint =
        record.length > columns.length
          ? ' A decimal comma, as in 2,31, splits a value in two; use a dot.'
          : '';
      lineErrors.push({
        line,
        field: 'line',
        message: `Expected ${columns.length} columns, found ${record.length}.${hint}`,
      });
      continue;
    }
    const cell = (column: CsvColumn) => record[position.get(column) as number];
    const rawValue = cell('value');
    const valueIsDecimal = DECIMAL.test(rawValue);
    if (!valueIsDecimal) {
      lineErrors.push({
        line,
        field: 'value',
        message: `Must be a number with a dot as decimal mark: ${rawValue || 'empty'}.`,
      });
    }
    const parsed = readingSchema.safeParse({
      serialNumber: cell('serial_number'),
      timestamp: cell('timestamp'),
      quantity: cell('quantity'),
      // An empty axis means "no direction" (C10).
      axis: cell('axis') === '' ? null : cell('axis'),
      // A stand-in when the value is already refused, so the other fields are still checked.
      value: valueIsDecimal ? Number(rawValue) : 0,
    });
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        lineErrors.push({
          line,
          field: csvField(String(issue.path[0] ?? 'line')),
          message: issue.message,
        });
      }
    } else if (valueIsDecimal) {
      readings.push(parsed.data);
      lines.push(line);
    }
  }

  if (lineErrors.length > 0) {
    return {
      ok: false,
      lineErrors,
      invalidLines: new Set(lineErrors.map((error) => error.line)).size,
    };
  }
  return { ok: true, readings, lines };
}

function checkHeader(columns: string[]): string | null {
  const missing = CSV_COLUMNS.filter((column) => !columns.includes(column));
  const unknown = columns.filter((column) => !(CSV_COLUMNS as readonly string[]).includes(column));
  const repeated = columns.filter((column, index) => columns.indexOf(column) !== index);
  const problems = [
    missing.length > 0 ? `missing ${missing.join(', ')}` : '',
    // An unknown column is refused, not ignored: its data would be dropped silently.
    unknown.length > 0 ? `unknown ${unknown.map((name) => name || '(empty)').join(', ')}` : '',
    repeated.length > 0 ? `repeated ${[...new Set(repeated)].join(', ')}` : '',
  ].filter(Boolean);
  return problems.length === 0
    ? null
    : `The header must name the columns ${CSV_COLUMNS.join(', ')}, in any order: ${problems.join('; ')}.`;
}
