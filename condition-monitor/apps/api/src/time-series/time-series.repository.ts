import { Injectable } from '@nestjs/common';
import type { Axis, DbQuantity } from '@condition-monitor/shared';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface SeriesRow {
  id: string;
  monitoringPointId: string;
  quantity: DbQuantity;
  axis: Axis | null;
  readingCount: number;
  firstTimestamp: Date | null;
  lastTimestamp: Date | null;
}

export interface MetricsRow {
  count: number;
  min: number | null;
  max: number | null;
  mean: number | null;
  stdDev: number | null;
  rms: number | null;
  firstTimestamp: Date | null;
  lastTimestamp: Date | null;
}

export interface BucketRow {
  start: Date;
  end: Date;
  min: number;
  max: number;
  count: number;
}

export interface Range {
  from?: string;
  to?: string;
}

/** Both ends included; a missing end leaves that side open. */
function within(range: Range): Prisma.Sql {
  return Prisma.sql`
    ${range.from ? Prisma.sql`AND timestamp >= ${range.from}::timestamptz` : Prisma.empty}
    ${range.to ? Prisma.sql`AND timestamp <= ${range.to}::timestamptz` : Prisma.empty}`;
}

/**
 * Reads of time-series and readings (ADR 0002). A series belongs to the user who owns
 * its point's machine's sector (A4); every query here starts from an owned series or
 * point. Aggregates run in the database, next to the data (C6).
 */
@Injectable()
export class TimeSeriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async pointIsOwned(ownerId: string, pointId: string): Promise<boolean> {
    const count = await this.prisma.monitoringPoint.count({
      where: { id: pointId, machine: { sector: { ownerId } } },
    });
    return count > 0;
  }

  async seriesIsOwned(ownerId: string, seriesId: string): Promise<boolean> {
    const count = await this.prisma.timeSeries.count({
      where: { id: seriesId, monitoringPoint: { machine: { sector: { ownerId } } } },
    });
    return count > 0;
  }

  /**
   * The series of a point, by quantity then axis, in the order the enums declare. The
   * count is the one each series keeps; the first and last instants are the two ends of
   * the primary key index, so no reading is scanned.
   */
  listOfPoint(pointId: string): Promise<SeriesRow[]> {
    return this.prisma.$queryRaw<SeriesRow[]>`
      SELECT t.id, t.monitoring_point_id AS "monitoringPointId", t.quantity::text AS quantity,
             t.axis::text AS axis, t.reading_count AS "readingCount",
             (SELECT min(timestamp) FROM readings WHERE series_id = t.id) AS "firstTimestamp",
             (SELECT max(timestamp) FROM readings WHERE series_id = t.id) AS "lastTimestamp"
      FROM time_series t
      WHERE t.monitoring_point_id = ${pointId}::uuid
      ORDER BY t.quantity, t.axis NULLS LAST, t.id`;
  }

  async metrics(seriesId: string, range: Range): Promise<MetricsRow> {
    const [row] = await this.prisma.$queryRaw<MetricsRow[]>`
      SELECT count(*)::int AS count, min(value) AS min, max(value) AS max, avg(value) AS mean,
             stddev_pop(value) AS "stdDev", sqrt(avg(value * value)) AS rms,
             min(timestamp) AS "firstTimestamp", max(timestamp) AS "lastTimestamp"
      FROM readings
      WHERE series_id = ${seriesId}::uuid ${within(range)}`;
    return row;
  }

  /** How many readings the interval holds, and its first and last instants. */
  async extent(
    seriesId: string,
    range: Range,
  ): Promise<{ count: number; first: Date | null; last: Date | null }> {
    const [row] = await this.prisma.$queryRaw<
      { count: number; first: Date | null; last: Date | null }[]
    >`
      SELECT count(*)::int AS count, min(timestamp) AS first, max(timestamp) AS last
      FROM readings
      WHERE series_id = ${seriesId}::uuid ${within(range)}`;
    return row;
  }

  readings(seriesId: string, range: Range): Promise<{ timestamp: Date; value: number }[]> {
    return this.prisma.$queryRaw`
      SELECT timestamp, value FROM readings
      WHERE series_id = ${seriesId}::uuid ${within(range)}
      ORDER BY timestamp`;
  }

  /**
   * The interval `[start, end]` split into `count` buckets of equal width, each with the
   * minimum and maximum of its readings. A reading at `end` falls in the last bucket.
   * Buckets without readings are not returned.
   */
  buckets(seriesId: string, start: Date, end: Date, count: number): Promise<BucketRow[]> {
    return this.prisma.$queryRaw<BucketRow[]>`
      WITH bounds AS (
        SELECT extract(epoch FROM ${start}::timestamptz) AS lo,
               extract(epoch FROM ${end}::timestamptz) AS hi
      ),
      placed AS (
        SELECT LEAST(width_bucket(extract(epoch FROM r.timestamp), b.lo, b.hi, ${count}::int),
                     ${count}::int) AS bucket, r.value
        FROM readings r, bounds b
        WHERE r.series_id = ${seriesId}::uuid
          AND r.timestamp BETWEEN ${start}::timestamptz AND ${end}::timestamptz
      )
      SELECT to_timestamp(b.lo + (p.bucket - 1) * (b.hi - b.lo) / ${count}::int) AS start,
             to_timestamp(b.lo + p.bucket * (b.hi - b.lo) / ${count}::int) AS "end",
             min(p.value) AS min, max(p.value) AS max, count(*)::int AS count
      FROM placed p, bounds b
      GROUP BY p.bucket, b.lo, b.hi
      ORDER BY p.bucket`;
  }

  /** One statement, so a series deleted meanwhile is simply not found. */
  async deleteOwned(ownerId: string, seriesId: string): Promise<boolean> {
    const { count } = await this.prisma.timeSeries.deleteMany({
      where: { id: seriesId, monitoringPoint: { machine: { sector: { ownerId } } } },
    });
    return count > 0;
  }
}
