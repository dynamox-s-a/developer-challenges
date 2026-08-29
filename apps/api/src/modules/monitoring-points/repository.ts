import type { MachineType, MonitoringPointListQuery, SensorModel } from "@dyn/contracts";
import { MONITORING_POINT_PAGE_SIZE } from "@dyn/contracts";
import {
  type Database,
  type MonitoringPointRow,
  machines,
  monitoringPoints,
  type SensorRow,
  sensors,
} from "@dyn/database";
import { asc, count, desc, eq, sql } from "drizzle-orm";

import {
  expectCreated,
  postgresForeignKeyConstraint,
  postgresUniqueConstraint,
} from "../../shared/db.js";

export interface MonitoringPointListRecord {
  id: string;
  machineId: string;
  machineName: string;
  machineType: MachineType;
  monitoringPointName: string;
  sensorId: string | null;
  sensorModel: SensorModel | null;
  createdAt: Date;
}

export interface SensorAttachInput {
  id: string;
  monitoringPointId: string;
  model: SensorModel;
  rejectedMachineTypes: readonly MachineType[];
}

export type SensorAttachOutcome =
  | { status: "created"; sensor: SensorRow }
  | { status: "not-found" }
  | { status: "incompatible" }
  | { status: "conflict"; reason: "sensor-id" | "monitoring-point" | "unknown" };

export interface MonitoringPointRepository {
  createMonitoringPoint: (machineId: string, name: string) => Promise<MonitoringPointRow | null>;
  listMonitoringPointsForMachine: (
    machineId: string
  ) => Promise<Array<{ point: MonitoringPointRow; sensor: SensorRow | null }>>;
  attachSensor: (input: SensorAttachInput) => Promise<SensorAttachOutcome>;
  listMonitoringPoints: (
    query: MonitoringPointListQuery
  ) => Promise<{ items: MonitoringPointListRecord[]; total: number }>;
}

function sensorConflictReason(
  constraint: string | undefined
): "sensor-id" | "monitoring-point" | "unknown" {
  if (constraint === "sensors_pkey") {
    return "sensor-id";
  }

  if (constraint === "sensors_monitoring_point_id_uidx") {
    return "monitoring-point";
  }

  return "unknown";
}

export function createMonitoringPointRepository(db: Database): MonitoringPointRepository {
  return {
    async createMonitoringPoint(machineId, name) {
      try {
        const rows = await db.insert(monitoringPoints).values({ machineId, name }).returning();
        return expectCreated(rows, "monitoring point");
      } catch (error) {
        if (postgresForeignKeyConstraint(error).matched) {
          return null;
        }
        throw error;
      }
    },

    listMonitoringPointsForMachine(machineId) {
      return db
        .select({ point: monitoringPoints, sensor: sensors })
        .from(monitoringPoints)
        .leftJoin(sensors, eq(sensors.monitoringPointId, monitoringPoints.id))
        .where(eq(monitoringPoints.machineId, machineId))
        .orderBy(asc(monitoringPoints.name), asc(monitoringPoints.id));
    },

    async attachSensor(input) {
      try {
        return await db.transaction(async (transaction) => {
          const [context] = await transaction
            .select({ machineType: machines.type })
            .from(monitoringPoints)
            .innerJoin(machines, eq(monitoringPoints.machineId, machines.id))
            .where(eq(monitoringPoints.id, input.monitoringPointId))
            .for("update", { of: machines })
            .limit(1);

          if (!context) {
            return { status: "not-found" };
          }

          if (input.rejectedMachineTypes.includes(context.machineType)) {
            return { status: "incompatible" };
          }

          const rows = await transaction
            .insert(sensors)
            .values({
              id: input.id,
              monitoringPointId: input.monitoringPointId,
              model: input.model,
            })
            .returning();
          return { status: "created", sensor: expectCreated(rows, "sensor") };
        });
      } catch (error) {
        const unique = postgresUniqueConstraint(error);
        if (unique.matched) {
          return { status: "conflict", reason: sensorConflictReason(unique.constraint) };
        }
        if (postgresForeignKeyConstraint(error).matched) {
          return { status: "not-found" };
        }
        throw error;
      }
    },

    async listMonitoringPoints(query) {
      const sortColumns = {
        machineName: machines.name,
        machineType: sql<string>`${machines.type}::text`,
        monitoringPointName: monitoringPoints.name,
        sensorModel: sql<string | null>`${sensors.model}::text`,
      } as const;
      const sortColumn = sortColumns[query.sortBy];
      const direction = query.sortOrder === "asc" ? asc : desc;
      const directedSort = direction(sortColumn);
      const primarySort =
        query.sortBy === "sensorModel" ? sql`${directedSort} nulls last` : directedSort;
      const offset = (query.page - 1) * MONITORING_POINT_PAGE_SIZE;

      const [items, countRows] = await Promise.all([
        db
          .select({
            id: monitoringPoints.id,
            machineId: machines.id,
            machineName: machines.name,
            machineType: machines.type,
            monitoringPointName: monitoringPoints.name,
            sensorId: sensors.id,
            sensorModel: sensors.model,
            createdAt: monitoringPoints.createdAt,
          })
          .from(monitoringPoints)
          .innerJoin(machines, eq(monitoringPoints.machineId, machines.id))
          .leftJoin(sensors, eq(sensors.monitoringPointId, monitoringPoints.id))
          .orderBy(primarySort, asc(monitoringPoints.id))
          .limit(MONITORING_POINT_PAGE_SIZE)
          .offset(offset),
        db.select({ value: count() }).from(monitoringPoints),
      ]);

      return { items, total: countRows[0]?.value ?? 0 };
    },
  };
}
