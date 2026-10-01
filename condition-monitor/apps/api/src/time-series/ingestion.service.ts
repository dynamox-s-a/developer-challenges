import { Injectable } from '@nestjs/common';
import {
  MAX_READINGS_PER_SERIES,
  quantityMapping,
  seriesLabel,
  type IngestionReport,
  type Reading,
} from '@condition-monitor/shared';
import { importRejected } from '../common/problem/problems';
import {
  IngestionRepository,
  keyOf,
  type IngestionOutcome,
  type ReadingRow,
} from './ingestion.repository';

/**
 * How errors point at a reading: by its index in a JSON body, or by its line in a CSV
 * file, where the header is line 1. Fields keep the names of their source, such as
 * `serialNumber` in JSON and `serial_number` in CSV.
 */
export interface Locator {
  unit: 'reading' | 'line';
  key: 'index' | 'line';
  of(position: number): number;
  field(name: 'serialNumber' | 'value' | 'readings'): string;
}

export const JSON_LOCATOR: Locator = {
  unit: 'reading',
  key: 'index',
  of: (position) => position,
  field: (name) => name,
};

interface ReadingError {
  at: number;
  field: 'serialNumber' | 'value';
  message: string;
}

/**
 * Stores readings from any source, JSON or CSV, with one set of rules (C3): every
 * reading is valid or none is stored (C4), a repeated reading is counted and ignored, a
 * different value at a stored instant is refused (C5), and no series grows past its
 * limit (C8).
 */
@Injectable()
export class IngestionService {
  constructor(private readonly repository: IngestionRepository) {}

  async ingest(ownerId: string, readings: Reading[], locator: Locator): Promise<IngestionReport> {
    const serials = [...new Set(readings.map((reading) => reading.serialNumber))];
    const targets = await this.repository.findTargets(ownerId, serials);
    const pointOf = new Map(targets.map((target) => [target.serialNumber, target.pointId]));

    const errors: ReadingError[] = [];
    const rows: ReadingRow[] = [];
    const first = new Map<string, ReadingRow>();
    readings.forEach((reading, at) => {
      const pointId = pointOf.get(reading.serialNumber);
      if (!pointId) {
        // Not installed, unknown, or another user's: the answer is the same (A4).
        errors.push({
          at,
          field: 'serialNumber',
          message: `No installed sensor with serial number ${reading.serialNumber}.`,
        });
        return;
      }
      const row: ReadingRow = {
        at,
        pointId,
        quantity: quantityMapping.toDb(reading.quantity),
        axis: reading.axis,
        timestamp: reading.timestamp,
        value: reading.value,
      };
      const instant = `${keyOf(row)}|${row.timestamp}`;
      const earlier = first.get(instant);
      if (!earlier) {
        first.set(instant, row);
        rows.push(row);
      } else if (earlier.value !== row.value) {
        errors.push({
          at,
          field: 'value',
          message: `Same series and timestamp as ${locator.key} ${locator.of(earlier.at)}, with another value: ${earlier.value}.`,
        });
      }
      // The same reading twice in one submission is a repeat, counted in the report.
    });
    if (errors.length > 0) throw this.rejection(errors, locator);

    const outcome = await this.repository.store(rows, (result) =>
      this.refusal(result, rows, readings, locator),
    );
    return this.report(outcome, readings, pointOf);
  }

  /** An error that undoes the transaction, or null to commit. */
  private refusal(
    outcome: IngestionOutcome,
    rows: ReadingRow[],
    readings: Reading[],
    locator: Locator,
  ): Error | null {
    if (outcome.conflicts.length > 0) {
      return this.rejection(
        outcome.conflicts.map(({ at, stored }) => ({
          at,
          field: 'value',
          message: `Conflicts with the stored value ${stored} at the same timestamp.`,
        })),
        locator,
      );
    }
    const full = outcome.series.filter((series) => series.total > MAX_READINGS_PER_SERIES);
    if (full.length > 0) {
      const errors = full.map((series) => {
        const at = rows.find((row) => keyOf(row) === keyOf(series))?.at ?? 0;
        const reading = readings[at];
        return {
          field: locator.field('readings'),
          message: `${reading.serialNumber}, ${seriesLabel(reading.quantity, reading.axis)}: would hold ${series.total.toLocaleString('en-US')} readings, above the limit of ${MAX_READINGS_PER_SERIES.toLocaleString('en-US')} per series.`,
        };
      });
      return importRejected(locator.unit, errors, full.length);
    }
    return null;
  }

  private rejection(errors: ReadingError[], locator: Locator) {
    const invalid = new Set(errors.map((error) => error.at)).size;
    return importRejected(
      locator.unit,
      errors.map(({ at, field, message }) => ({
        [locator.key]: locator.of(at),
        field: locator.field(field),
        message,
      })),
      invalid,
    );
  }

  private report(
    outcome: IngestionOutcome,
    readings: Reading[],
    pointOf: Map<string, string>,
  ): IngestionReport {
    const sent = new Map<string, number>();
    for (const reading of readings) {
      sent.set(reading.serialNumber, (sent.get(reading.serialNumber) ?? 0) + 1);
    }
    const sensors = [...sent.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([serialNumber, count]) => {
        const pointId = pointOf.get(serialNumber) as string;
        const series = outcome.series.filter((item) => item.pointId === pointId);
        const readingsInserted = series.reduce((sum, item) => sum + item.inserted, 0);
        return {
          serialNumber,
          monitoringPointId: pointId,
          seriesCreated: series.filter((item) => item.created).length,
          readingsInserted,
          readingsRepeated: count - readingsInserted,
        };
      });
    return {
      sensors,
      totals: {
        seriesCreated: sensors.reduce((sum, item) => sum + item.seriesCreated, 0),
        readingsInserted: sensors.reduce((sum, item) => sum + item.readingsInserted, 0),
        readingsRepeated: sensors.reduce((sum, item) => sum + item.readingsRepeated, 0),
      },
    };
  }
}
