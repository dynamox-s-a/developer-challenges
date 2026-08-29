import { isoDateTimeSchema, TIME_SERIES_MAX_SAMPLES, type TimeSeriesSample } from "@dyn/contracts";

export const MAX_CSV_SAMPLES = TIME_SERIES_MAX_SAMPLES;
export const CSV_TEMPLATE = [
  "timestamp,x,y,z",
  "2026-01-01T00:00:00.000Z,0,0,0",
  "2026-01-01T00:00:01.000Z,0.1,-0.1,0.2",
].join("\n");
export const CSV_TEMPLATE_URL = `data:text/csv;charset=utf-8,${encodeURIComponent(CSV_TEMPLATE)}`;
const REQUIRED_HEADERS = ["timestamp", "x", "y", "z"] as const;
const DECIMAL_NUMBER = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;

export class CsvParseError extends Error {}

function parseNumber(value: string, row: number, field: string): number {
  const normalized = value.trim();
  if (!normalized) {
    throw new CsvParseError(`Row ${row} is missing ${field}.`);
  }
  const number = Number(normalized);
  if (!DECIMAL_NUMBER.test(normalized) || !Number.isFinite(number)) {
    throw new CsvParseError(`Row ${row} has an invalid ${field} value.`);
  }
  return number;
}

// Cells never contain commas or escaped quotes in this grammar, so unquoting is a plain strip of
// one surrounding pair (spreadsheet exports quote cells that way).
function unquote(cell: string): string {
  return cell.length >= 2 && cell.startsWith('"') && cell.endsWith('"') ? cell.slice(1, -1) : cell;
}

export function parseSensorCsv(source: string): TimeSeriesSample[] {
  const [headerRow, ...sampleRows] = source
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .map((line) => line.split(",").map(unquote));
  if (!headerRow || sampleRows.length === 0) {
    throw new CsvParseError("The CSV must include a header and at least one sample.");
  }

  if (
    headerRow.length !== REQUIRED_HEADERS.length ||
    headerRow.some((header, index) => header !== REQUIRED_HEADERS[index])
  ) {
    throw new CsvParseError("The CSV header must be exactly timestamp,x,y,z.");
  }

  if (sampleRows.length > MAX_CSV_SAMPLES) {
    throw new CsvParseError(
      `The CSV contains ${sampleRows.length.toLocaleString()} samples; the maximum is ${MAX_CSV_SAMPLES.toLocaleString()}.`
    );
  }

  const timestamps = new Set<string>();
  const samples = sampleRows.map((cells, index) => {
    const row = index + 2;
    if (cells.length !== REQUIRED_HEADERS.length) {
      throw new CsvParseError(`Row ${row} must contain exactly four columns.`);
    }

    const timestampValue = cells[0]?.trim() ?? "";
    if (!isoDateTimeSchema.safeParse(timestampValue).success) {
      throw new CsvParseError(`Row ${row} has an invalid timestamp; use ISO 8601 with a timezone.`);
    }
    const timestamp = new Date(timestampValue).toISOString();
    if (timestamps.has(timestamp)) {
      throw new CsvParseError(`Row ${row} duplicates timestamp ${timestamp}.`);
    }
    timestamps.add(timestamp);

    return {
      timestamp,
      x: parseNumber(cells[1] ?? "", row, "x"),
      y: parseNumber(cells[2] ?? "", row, "y"),
      z: parseNumber(cells[3] ?? "", row, "z"),
    };
  });

  return samples.sort((left, right) => left.timestamp.localeCompare(right.timestamp));
}
