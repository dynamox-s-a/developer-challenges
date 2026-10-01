import { Injectable } from '@nestjs/common';
import type { Axis, DbQuantity } from '@condition-monitor/shared';
import { PrismaService } from '../prisma/prisma.service';

/** A reading ready to store: its point resolved, its position in the submission kept. */
export interface ReadingRow {
  /** Position in the submission, to point an error at the right reading or line. */
  at: number;
  pointId: string;
  quantity: DbQuantity;
  axis: Axis | null;
  timestamp: string;
  value: number;
}

export interface SeriesKey {
  pointId: string;
  quantity: DbQuantity;
  axis: Axis | null;
}

export interface StoredSeries extends SeriesKey {
  id: string;
  created: boolean;
  inserted: number;
  /** Readings the series holds after this submission. */
  total: number;
}

/** A reading whose instant already holds another value in its series (C5). */
export interface ValueConflict {
  at: number;
  stored: number;
}

export interface IngestionOutcome {
  series: StoredSeries[];
  conflicts: ValueConflict[];
}

/** An owned, installed sensor: where its readings go. */
export interface SensorTarget {
  serialNumber: string;
  pointId: string;
}

/** Raised inside the transaction to undo everything it wrote. */
export class IngestionRolledBack extends Error {
  constructor(readonly reason: unknown) {
    super('Ingestion rolled back');
  }
}

/**
 * The only place that writes readings (ADR 0002). One submission is one transaction, so a
 * refused submission leaves nothing behind (C4).
 */
@Injectable()
export class IngestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * The sensors among these serial numbers that are installed at a point of the user. A
   * sensor of another user is not found, exactly like one that does not exist (A4).
   */
  findTargets(ownerId: string, serialNumbers: string[]): Promise<SensorTarget[]> {
    return this.prisma.$queryRaw<SensorTarget[]>`
      SELECT se.serial_number AS "serialNumber", se.monitoring_point_id AS "pointId"
      FROM sensors se
      JOIN monitoring_points p ON p.id = se.monitoring_point_id
      JOIN machines m ON m.id = p.machine_id
      JOIN sectors s ON s.id = m.sector_id
      WHERE s.owner_id = ${ownerId}::uuid AND se.serial_number = ANY(${serialNumbers}::text[])`;
  }

  /**
   * Stores the readings, creating the series they need, in one transaction:
   *
   * 1. Missing series are created; a series created meanwhile by another submission is
   *    simply found (ON CONFLICT DO NOTHING waits for it).
   * 2. The series rows are locked in id order. Two submissions to the same series then
   *    run one after the other, so neither can push it past its limit unseen, and the
   *    fixed order means they cannot deadlock.
   * 3. Readings are inserted, skipping instants already stored.
   * 4. Every sent reading now exists; one whose stored value differs is a conflict.
   *    Checking after the insert, not before, leaves no gap for a concurrent writer.
   *
   * `reject` sees the outcome before the commit; an error it returns undoes everything.
   */
  async store(
    rows: ReadingRow[],
    reject: (outcome: IngestionOutcome) => Error | null,
  ): Promise<IngestionOutcome> {
    const keys = uniqueKeys(rows);
    try {
      return await this.prisma.$transaction(
        async (tx) => {
          const created = await tx.$queryRaw<{ id: string }[]>`
            INSERT INTO time_series (monitoring_point_id, quantity, axis, updated_at)
            SELECT point_id, quantity, axis, now()
            FROM unnest(
              ${keys.map((key) => key.pointId)}::uuid[],
              ${keys.map((key) => key.quantity)}::quantity[],
              ${keys.map((key) => key.axis)}::axis[]
            ) AS k(point_id, quantity, axis)
            ON CONFLICT (monitoring_point_id, quantity, axis) DO NOTHING
            RETURNING id`;
          const createdIds = new Set(created.map((row) => row.id));

          const locked = await tx.$queryRaw<(SeriesKey & { id: string })[]>`
            SELECT t.id, t.monitoring_point_id AS "pointId", t.quantity::text AS quantity,
                   t.axis::text AS axis
            FROM time_series t
            JOIN unnest(
              ${keys.map((key) => key.pointId)}::uuid[],
              ${keys.map((key) => key.quantity)}::quantity[],
              ${keys.map((key) => key.axis)}::axis[]
            ) AS k(point_id, quantity, axis)
              ON t.monitoring_point_id = k.point_id AND t.quantity = k.quantity
             AND t.axis IS NOT DISTINCT FROM k.axis
            ORDER BY t.id
            FOR UPDATE OF t`;
          const seriesOf = new Map(locked.map((series) => [keyOf(series), series.id]));
          const seriesIds = rows.map((row) => seriesOf.get(keyOf(row)) as string);

          const inserted = await tx.$queryRaw<{ seriesId: string; inserted: number }[]>`
            WITH added AS (
              INSERT INTO readings (series_id, timestamp, value)
              SELECT * FROM unnest(
                ${seriesIds}::uuid[],
                ${rows.map((row) => row.timestamp)}::timestamptz[],
                ${rows.map((row) => row.value)}::float8[]
              )
              ON CONFLICT (series_id, timestamp) DO NOTHING
              RETURNING series_id
            )
            SELECT series_id AS "seriesId", count(*)::int AS inserted
            FROM added GROUP BY series_id`;

          const conflicts = await tx.$queryRaw<ValueConflict[]>`
            SELECT sent.at, r.value AS stored
            FROM unnest(
              ${seriesIds}::uuid[],
              ${rows.map((row) => row.timestamp)}::timestamptz[],
              ${rows.map((row) => row.value)}::float8[],
              ${rows.map((row) => row.at)}::int[]
            ) AS sent(series_id, ts, value, at)
            JOIN readings r ON r.series_id = sent.series_id AND r.timestamp = sent.ts
            WHERE r.value <> sent.value
            ORDER BY sent.at`;

          // Kept by the readings triggers, already updated by the insert above.
          const totals = await tx.$queryRaw<{ seriesId: string; total: number }[]>`
            SELECT id AS "seriesId", reading_count AS total
            FROM time_series WHERE id = ANY(${locked.map((series) => series.id)}::uuid[])`;

          const insertedOf = new Map(inserted.map((row) => [row.seriesId, row.inserted]));
          const totalOf = new Map(totals.map((row) => [row.seriesId, row.total]));
          const outcome: IngestionOutcome = {
            series: locked.map((series) => ({
              ...series,
              created: createdIds.has(series.id),
              inserted: insertedOf.get(series.id) ?? 0,
              total: totalOf.get(series.id) ?? 0,
            })),
            conflicts,
          };
          const refusal = reject(outcome);
          if (refusal) throw new IngestionRolledBack(refusal);
          return outcome;
        },
        { timeout: 30_000 },
      );
    } catch (error) {
      if (error instanceof IngestionRolledBack) throw error.reason;
      throw error;
    }
  }
}

export function keyOf(key: SeriesKey): string {
  return `${key.pointId}|${key.quantity}|${key.axis ?? ''}`;
}

function uniqueKeys(rows: ReadingRow[]): SeriesKey[] {
  const keys = new Map<string, SeriesKey>();
  for (const { pointId, quantity, axis } of rows) {
    keys.set(keyOf({ pointId, quantity, axis }), { pointId, quantity, axis });
  }
  return [...keys.values()];
}
