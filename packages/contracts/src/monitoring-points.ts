import { z } from "zod";

import {
  idSchema,
  isoDateTimeSchema,
  nameSchema,
  paginationSchema,
  sortOrderSchema,
} from "./common.js";
import { machineTypeSchema } from "./machines.js";

export const sensorModelSchema = z.enum(["TcAg", "TcAs", "HF+"]);
export const sensorIdSchema = z.string().trim().min(1).max(120);

export const createMonitoringPointRequestSchema = z
  .object({
    name: nameSchema,
  })
  .strict();

export const attachSensorRequestSchema = z
  .object({
    sensorId: sensorIdSchema,
    model: sensorModelSchema,
  })
  .strict();

export const sensorSchema = z.object({
  id: sensorIdSchema,
  monitoringPointId: idSchema,
  model: sensorModelSchema,
  createdAt: isoDateTimeSchema,
});

export const monitoringPointSchema = z.object({
  id: idSchema,
  machineId: idSchema,
  name: nameSchema,
  sensor: sensorSchema.nullable(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const monitoringPointListForMachineResponseSchema = z.array(monitoringPointSchema);

export const monitoringPointSortBySchema = z.enum([
  "machineName",
  "machineType",
  "monitoringPointName",
  "sensorModel",
]);

export const MONITORING_POINT_PAGE_SIZE = 5;

export const monitoringPointListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  sortBy: monitoringPointSortBySchema.default("monitoringPointName"),
  sortOrder: sortOrderSchema.default("asc"),
});

export const monitoringPointListItemSchema = z.object({
  id: idSchema,
  machineId: idSchema,
  machineName: nameSchema,
  machineType: machineTypeSchema,
  monitoringPointName: nameSchema,
  sensorId: sensorIdSchema.nullable(),
  sensorModel: sensorModelSchema.nullable(),
  createdAt: isoDateTimeSchema,
});

export const monitoringPointListResponseSchema = paginationSchema.extend({
  items: z.array(monitoringPointListItemSchema),
  pageSize: z.literal(MONITORING_POINT_PAGE_SIZE),
  sortBy: monitoringPointSortBySchema,
  sortOrder: sortOrderSchema,
});

export type SensorModel = z.infer<typeof sensorModelSchema>;
export type Sensor = z.infer<typeof sensorSchema>;
export type CreateMonitoringPointRequest = z.infer<typeof createMonitoringPointRequestSchema>;
export type AttachSensorRequest = z.infer<typeof attachSensorRequestSchema>;
export type MonitoringPoint = z.infer<typeof monitoringPointSchema>;
export type MonitoringPointListForMachineResponse = z.infer<
  typeof monitoringPointListForMachineResponseSchema
>;
export type MonitoringPointSortBy = z.infer<typeof monitoringPointSortBySchema>;
export type MonitoringPointListQuery = z.infer<typeof monitoringPointListQuerySchema>;
export type MonitoringPointListItem = z.infer<typeof monitoringPointListItemSchema>;
export type MonitoringPointListResponse = z.infer<typeof monitoringPointListResponseSchema>;
