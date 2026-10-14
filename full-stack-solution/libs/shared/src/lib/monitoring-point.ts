import { z } from "zod";
import type { MachineType } from "./machine";
import type { SensorModel } from "./sensor";

export const MIN_MONITORING_POINTS_PER_MACHINE = 2;
export const MONITORING_POINTS_PAGE_SIZE = 5;

const monitoringPointNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name must have at most 100 characters");

export const createMonitoringPointSchema = z.object({
  name: monitoringPointNameSchema,
});
export type CreateMonitoringPointInput = z.infer<
  typeof createMonitoringPointSchema
>;

export const updateMonitoringPointSchema = createMonitoringPointSchema;
export type UpdateMonitoringPointInput = CreateMonitoringPointInput;

export const MONITORING_POINT_SORT_FIELDS = [
  "machineName",
  "machineType",
  "name",
  "sensorModel",
] as const;
export type MonitoringPointSortField =
  (typeof MONITORING_POINT_SORT_FIELDS)[number];

export type SortOrder = "asc" | "desc";

export const listMonitoringPointsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(MONITORING_POINTS_PAGE_SIZE),
  sortBy: z.enum(MONITORING_POINT_SORT_FIELDS).default("machineName"),
  order: z.enum(["asc", "desc"]).default("asc"),
});
export type ListMonitoringPointsQuery = z.infer<
  typeof listMonitoringPointsQuerySchema
>;

export interface MonitoringPoint {
  id: string;
  name: string;
  machineId: string;
  machineName: string;
  machineType: MachineType;
  sensorId: string | null;
  sensorModel: SensorModel | null;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}
