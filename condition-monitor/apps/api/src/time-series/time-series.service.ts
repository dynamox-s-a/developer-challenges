import { Injectable } from '@nestjs/common';
import {
  quantityMapping,
  seriesLabel,
  unitOf,
  type ReadingsAnswer,
  type ReadingsQuery,
  type SeriesMetrics,
  type TimeRangeQuery,
  type TimeSeriesSummary,
} from '@condition-monitor/shared';
import { notFound } from '../common/problem/problems';
import { TimeSeriesRepository } from './time-series.repository';

const iso = (date: Date | null) => (date ? date.toISOString() : null);

/** Series of a point, their metrics and readings, and their deletion (C1, C6, C7). */
@Injectable()
export class TimeSeriesService {
  constructor(private readonly repository: TimeSeriesRepository) {}

  async listOfPoint(ownerId: string, pointId: string): Promise<TimeSeriesSummary[]> {
    if (!(await this.repository.pointIsOwned(ownerId, pointId))) {
      throw notFound('Monitoring point');
    }
    const rows = await this.repository.listOfPoint(pointId);
    return rows.map((row) => {
      const quantity = quantityMapping.fromDb(row.quantity);
      return {
        id: row.id,
        monitoringPointId: row.monitoringPointId,
        quantity,
        axis: row.axis,
        unit: unitOf(quantity),
        label: seriesLabel(quantity, row.axis),
        readingCount: row.readingCount,
        firstTimestamp: iso(row.firstTimestamp),
        lastTimestamp: iso(row.lastTimestamp),
      };
    });
  }

  async metrics(ownerId: string, seriesId: string, range: TimeRangeQuery): Promise<SeriesMetrics> {
    await this.ensureOwned(ownerId, seriesId);
    const row = await this.repository.metrics(seriesId, range);
    return {
      ...row,
      firstTimestamp: iso(row.firstTimestamp),
      lastTimestamp: iso(row.lastTimestamp),
    };
  }

  /**
   * Every reading of the interval, unless there are more than `maxPoints`: then the
   * interval is split into `maxPoints / 2` buckets, two points each (ADR 0009).
   */
  async readings(ownerId: string, seriesId: string, query: ReadingsQuery): Promise<ReadingsAnswer> {
    await this.ensureOwned(ownerId, seriesId);
    const range = { from: query.from, to: query.to };
    const extent = await this.repository.extent(seriesId, range);

    if (!query.maxPoints || extent.count <= query.maxPoints || !extent.first || !extent.last) {
      const rows = await this.repository.readings(seriesId, range);
      return {
        downsampled: false,
        readings: rows.map((row) => ({ timestamp: row.timestamp.toISOString(), value: row.value })),
      };
    }

    // The requested interval, or the data's own ends where the request leaves one open.
    const start = query.from ? new Date(query.from) : extent.first;
    const end = query.to ? new Date(query.to) : extent.last;
    const buckets = await this.repository.buckets(
      seriesId,
      start,
      end,
      Math.floor(query.maxPoints / 2),
    );
    return {
      downsampled: true,
      buckets: buckets.map((bucket) => ({
        ...bucket,
        start: bucket.start.toISOString(),
        end: bucket.end.toISOString(),
      })),
    };
  }

  /** Removes the series and its readings. A later reading of it creates it again (C1). */
  async delete(ownerId: string, seriesId: string): Promise<void> {
    if (!(await this.repository.deleteOwned(ownerId, seriesId))) throw notFound('Time-series');
  }

  private async ensureOwned(ownerId: string, seriesId: string): Promise<void> {
    if (!(await this.repository.seriesIsOwned(ownerId, seriesId))) {
      throw notFound('Time-series');
    }
  }
}
