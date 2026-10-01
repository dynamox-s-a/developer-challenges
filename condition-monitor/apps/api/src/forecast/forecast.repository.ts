import { Injectable } from '@nestjs/common';
import type { DbQuantity } from '@condition-monitor/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { HourlyMean } from './build-forecast';

export interface SeriesState {
  quantity: DbQuantity;
  readingCount: number;
  latest: Date | null;
}

/** Reads what a forecast is computed from (ADR 0002). */
@Injectable()
export class ForecastRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * What identifies the data of a series of the user: its quantity, how many readings it
   * holds and the instant of the latest. Null when the user has no such series (A4). One
   * light query: the count is kept by the database, the latest is the end of an index.
   */
  async stateOfOwned(ownerId: string, seriesId: string): Promise<SeriesState | null> {
    const [state] = await this.prisma.$queryRaw<SeriesState[]>`
      SELECT t.quantity::text AS quantity, t.reading_count AS "readingCount",
             (SELECT max(timestamp) FROM readings WHERE series_id = t.id) AS latest
      FROM time_series t
      JOIN monitoring_points p ON p.id = t.monitoring_point_id
      JOIN machines m ON m.id = p.machine_id
      JOIN sectors s ON s.id = m.sector_id
      WHERE t.id = ${seriesId}::uuid AND s.owner_id = ${ownerId}::uuid`;
    return state ?? null;
  }

  /**
   * The mean of the readings of each hour, oldest first, over the last `hours` hours of
   * the series. The database aggregates, so a series of 50,000 readings arrives as a few
   * thousand rows. Hours are cut in UTC, whatever the time zone of the session.
   */
  hourlyMeans(seriesId: string, hours: number): Promise<HourlyMean[]> {
    return this.prisma.$queryRaw<HourlyMean[]>`
      WITH latest AS (
        SELECT max(timestamp) AS at FROM readings WHERE series_id = ${seriesId}::uuid
      )
      SELECT date_trunc('hour', r.timestamp, 'UTC') AS hour, avg(r.value) AS value
      FROM readings r, latest
      WHERE r.series_id = ${seriesId}::uuid
        AND r.timestamp >= date_trunc('hour', latest.at, 'UTC') - ${hours} * interval '1 hour'
      GROUP BY 1
      ORDER BY 1`;
  }
}
