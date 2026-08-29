import type { TimeSeriesListQuery, TimeSeriesSample } from "@dyn/contracts";
import {
  type Database,
  type MonitoringPointRow,
  monitoringPoints,
  type SensorRow,
  sensors,
  type TimeSeriesRow,
  timeSeries,
  timeSeriesSamples,
} from "@dyn/database";
import { asc, count, desc, eq, sql } from "drizzle-orm";

import { expectCreated } from "../../shared/db.js";

export interface MonitoringPointContext {
  point: MonitoringPointRow;
  sensor: SensorRow | null;
}

export interface TimeSeriesSummaryRecord {
  series: TimeSeriesRow;
  sensorId: string;
  monitoringPointId: string;
}

export interface TimeSeriesMetricsRecord {
  sampleCount: number;
  startedAt: Date;
  endedAt: Date;
  xMin: number;
  xMax: number;
  xMean: number;
  xRms: number;
  yMin: number;
  yMax: number;
  yMean: number;
  yRms: number;
  zMin: number;
  zMax: number;
  zMean: number;
  zRms: number;
  vectorMagnitudeRms: number;
}

export interface TimeSeriesRepository {
  findMonitoringPointContext: (id: string) => Promise<MonitoringPointContext | null>;
  createTimeSeries: (input: {
    sensorId: string;
    label: string | null;
    samples: TimeSeriesSample[];
  }) => Promise<TimeSeriesRow>;
  listTimeSeries: (
    query: TimeSeriesListQuery
  ) => Promise<{ items: TimeSeriesSummaryRecord[]; total: number }>;
  findTimeSeries: (id: string) => Promise<TimeSeriesSummaryRecord | null>;
  listTimeSeriesSamples: (seriesId: string) => Promise<TimeSeriesSample[]>;
  calculateTimeSeriesMetrics: (seriesId: string) => Promise<TimeSeriesMetricsRecord | null>;
  deleteTimeSeries: (id: string) => Promise<boolean>;
}

export function createTimeSeriesRepository(db: Database): TimeSeriesRepository {
  return {
    // Storing a series needs the owning point and its sensor, so the lookup belongs to the
    // operation that consumes it.
    async findMonitoringPointContext(id) {
      const [record] = await db
        .select({
          point: monitoringPoints,
          sensor: sensors,
        })
        .from(monitoringPoints)
        .leftJoin(sensors, eq(sensors.monitoringPointId, monitoringPoints.id))
        .where(eq(monitoringPoints.id, id))
        .limit(1);

      return record ?? null;
    },

    async createTimeSeries(input) {
      return db.transaction(async (transaction) => {
        const sortedSamples = [...input.samples].sort(
          (left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime()
        );
        const first = sortedSamples[0];
        const last = sortedSamples.at(-1);

        if (!first || !last) {
          throw new Error("Cannot persist an empty time series");
        }

        const rows = await transaction
          .insert(timeSeries)
          .values({
            sensorId: input.sensorId,
            label: input.label,
            sampleCount: sortedSamples.length,
            startedAt: new Date(first.timestamp),
            endedAt: new Date(last.timestamp),
          })
          .returning();
        const series = expectCreated(rows, "time series");

        // The 10,000-sample maximum times five columns stays under Postgres's 65,535
        // bind-parameter cap, so the whole series fits in one insert.
        await transaction.insert(timeSeriesSamples).values(
          sortedSamples.map((sample) => ({
            seriesId: series.id,
            timestamp: new Date(sample.timestamp),
            x: sample.x,
            y: sample.y,
            z: sample.z,
          }))
        );

        return series;
      });
    },

    async listTimeSeries(query) {
      const where = query.monitoringPointId
        ? eq(sensors.monitoringPointId, query.monitoringPointId)
        : undefined;
      const offset = (query.page - 1) * query.pageSize;
      const selection = {
        series: timeSeries,
        sensorId: sensors.id,
        monitoringPointId: sensors.monitoringPointId,
      };

      const [items, countRows] = await Promise.all([
        db
          .select(selection)
          .from(timeSeries)
          .innerJoin(sensors, eq(sensors.id, timeSeries.sensorId))
          .where(where)
          .orderBy(desc(timeSeries.createdAt), desc(timeSeries.id))
          .limit(query.pageSize)
          .offset(offset),
        db
          .select({ value: count() })
          .from(timeSeries)
          .innerJoin(sensors, eq(sensors.id, timeSeries.sensorId))
          .where(where),
      ]);

      return { items, total: countRows[0]?.value ?? 0 };
    },

    async findTimeSeries(id) {
      const [result] = await db
        .select({
          series: timeSeries,
          sensorId: sensors.id,
          monitoringPointId: sensors.monitoringPointId,
        })
        .from(timeSeries)
        .innerJoin(sensors, eq(sensors.id, timeSeries.sensorId))
        .where(eq(timeSeries.id, id))
        .limit(1);
      return result ?? null;
    },

    async listTimeSeriesSamples(seriesId) {
      const rows = await db
        .select({
          timestamp: timeSeriesSamples.timestamp,
          x: timeSeriesSamples.x,
          y: timeSeriesSamples.y,
          z: timeSeriesSamples.z,
        })
        .from(timeSeriesSamples)
        .where(eq(timeSeriesSamples.seriesId, seriesId))
        .orderBy(asc(timeSeriesSamples.timestamp));

      return rows.map((sample) => ({
        timestamp: sample.timestamp.toISOString(),
        x: sample.x,
        y: sample.y,
        z: sample.z,
      }));
    },

    async calculateTimeSeriesMetrics(seriesId) {
      const [result] = await db
        .select({
          sampleCount: sql<number>`count(*)::integer`,
          startedAt: sql<Date>`min(${timeSeriesSamples.timestamp})`.mapWith(
            timeSeriesSamples.timestamp
          ),
          endedAt: sql<Date>`max(${timeSeriesSamples.timestamp})`.mapWith(
            timeSeriesSamples.timestamp
          ),
          xMin: sql<number>`min(${timeSeriesSamples.x})::double precision`,
          xMax: sql<number>`max(${timeSeriesSamples.x})::double precision`,
          xMean: sql<number>`avg(${timeSeriesSamples.x})::double precision`,
          xRms: sql<number>`sqrt(avg(${timeSeriesSamples.x} * ${timeSeriesSamples.x}))::double precision`,
          yMin: sql<number>`min(${timeSeriesSamples.y})::double precision`,
          yMax: sql<number>`max(${timeSeriesSamples.y})::double precision`,
          yMean: sql<number>`avg(${timeSeriesSamples.y})::double precision`,
          yRms: sql<number>`sqrt(avg(${timeSeriesSamples.y} * ${timeSeriesSamples.y}))::double precision`,
          zMin: sql<number>`min(${timeSeriesSamples.z})::double precision`,
          zMax: sql<number>`max(${timeSeriesSamples.z})::double precision`,
          zMean: sql<number>`avg(${timeSeriesSamples.z})::double precision`,
          zRms: sql<number>`sqrt(avg(${timeSeriesSamples.z} * ${timeSeriesSamples.z}))::double precision`,
          vectorMagnitudeRms: sql<number>`sqrt(avg(
            ${timeSeriesSamples.x} * ${timeSeriesSamples.x}
            + ${timeSeriesSamples.y} * ${timeSeriesSamples.y}
            + ${timeSeriesSamples.z} * ${timeSeriesSamples.z}
          ))::double precision`,
        })
        .from(timeSeriesSamples)
        .where(eq(timeSeriesSamples.seriesId, seriesId));

      return result?.sampleCount ? result : null;
    },

    async deleteTimeSeries(id) {
      const deleted = await db
        .delete(timeSeries)
        .where(eq(timeSeries.id, id))
        .returning({ id: timeSeries.id });
      return deleted.length > 0;
    },
  };
}
