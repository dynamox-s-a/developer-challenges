import { sql } from "drizzle-orm";
import {
  check,
  doublePrecision,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const machineTypeEnum = pgEnum("machine_type", ["Pump", "Fan"]);
export const sensorModelEnum = pgEnum("sensor_model", ["TcAg", "TcAs", "HF+"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Stored lowercased; the contracts normalize before it reaches the database.
    email: varchar("email", { length: 254 }).notNull(),
    passwordSalt: varchar("password_salt", { length: 64 }).notNull(),
    passwordHash: varchar("password_hash", { length: 128 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("users_email_uidx").on(table.email)]
);

export const machines = pgTable(
  "machines",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 120 }).notNull(),
    type: machineTypeEnum("type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => [index("machines_name_idx").on(table.name)]
);

export const monitoringPoints = pgTable(
  "monitoring_points",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    machineId: uuid("machine_id")
      .notNull()
      .references(() => machines.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("monitoring_points_machine_name_idx").on(table.machineId, table.name),
    index("monitoring_points_name_idx").on(table.name),
  ]
);

export const sensors = pgTable(
  "sensors",
  {
    id: varchar("id", { length: 120 }).primaryKey(),
    monitoringPointId: uuid("monitoring_point_id")
      .notNull()
      .references(() => monitoringPoints.id, { onDelete: "cascade" }),
    model: sensorModelEnum("model").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("sensors_monitoring_point_id_uidx").on(table.monitoringPointId),
    index("sensors_model_idx").on(table.model),
  ]
);

export const timeSeries = pgTable(
  "time_series",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sensorId: varchar("sensor_id", { length: 120 })
      .notNull()
      .references(() => sensors.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 120 }),
    sampleCount: integer("sample_count").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true, mode: "date" }).notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true, mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("time_series_sensor_id_idx").on(table.sensorId),
    index("time_series_created_at_idx").on(table.createdAt),
    check("time_series_sample_count_check", sql`${table.sampleCount} between 1 and 10000`),
    check("time_series_date_order_check", sql`${table.startedAt} <= ${table.endedAt}`),
  ]
);

export const timeSeriesSamples = pgTable(
  "time_series_samples",
  {
    seriesId: uuid("series_id")
      .notNull()
      .references(() => timeSeries.id, { onDelete: "cascade" }),
    timestamp: timestamp("timestamp", { withTimezone: true, mode: "date" }).notNull(),
    x: doublePrecision("x").notNull(),
    y: doublePrecision("y").notNull(),
    z: doublePrecision("z").notNull(),
  },
  (table) => [primaryKey({ columns: [table.seriesId, table.timestamp] })]
);

export type UserRow = typeof users.$inferSelect;
export type MachineRow = typeof machines.$inferSelect;
export type MonitoringPointRow = typeof monitoringPoints.$inferSelect;
export type SensorRow = typeof sensors.$inferSelect;
export type TimeSeriesRow = typeof timeSeries.$inferSelect;
export type TimeSeriesSampleRow = typeof timeSeriesSamples.$inferSelect;
