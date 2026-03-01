/**
 * @fileoverview Monitoring Point schemas shared between API and Web App.
 * Defines runtime validation schemas and derived TypeScript types
 * for MonitoringPoint request/response contracts.
 */
import { Type, Static } from '@sinclair/typebox';
import { SensorModelSchema } from '../sensors/sensor.schema.js';
import { PaginationMetadataSchema, PaginationQuerySchema } from '../shared/pagination.schema.js';
// Params Schemas

export const MonitoringPointParamsSchema = Type.Object({
  uuid: Type.String({ format: 'uuid' }),
});

// Query Schemas

export const MonitoringPointSortBySchema = Type.Union([
  Type.Literal('name'),
  Type.Literal('machineName'),
  Type.Literal('machineType'),
  Type.Literal('sensorModel'),
]);

export const MonitoringPointsQuerySchema = Type.Intersect([
  PaginationQuerySchema,
  Type.Object({
    sortBy: Type.Optional(MonitoringPointSortBySchema),
    sortOrder: Type.Optional(Type.Union([Type.Literal('asc'), Type.Literal('desc')])),
  }),
]);

// Body Schemas

export const CreateMonitoringPointRequestSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  machineUuid: Type.String({ format: 'uuid' }),
  sensorModel: Type.Optional(SensorModelSchema),
});

// Model Schemas

export const MonitoringPointSchema = Type.Object({
  id: Type.Number(),
  uuid: Type.String(),
  name: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export const MonitoringPointWithSensorSchema = Type.Intersect([
  MonitoringPointSchema,
  Type.Object({
    sensor: Type.Optional(Type.Object({ uuid: Type.String(), model: SensorModelSchema })),
  }),
]);

export const MonitoringPointWithMachineAndSensorSchema = Type.Intersect([
  MonitoringPointWithSensorSchema,
  Type.Object({
    machine: Type.Object({
      uuid: Type.String(),
      name: Type.String(),
      type: Type.Union([Type.Literal('Pump'), Type.Literal('Fan')]),
    }),
  }),
]);

export const PaginatedMonitoringPointsListResponseSchema = Type.Object({
  monitoringPoints: Type.Array(MonitoringPointWithMachineAndSensorSchema),
  pagination: PaginationMetadataSchema,
});

export const CreateMonitoringPointResponseSchema = Type.Intersect([
  Type.Pick(MonitoringPointSchema, ['id', 'uuid', 'name', 'createdAt']),
  Type.Object({
    sensor: Type.Optional(Type.Object({ uuid: Type.String(), model: SensorModelSchema })),
  }),
]);

export const PatchMonitoringPointRequestSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  sensorModel: Type.Optional(SensorModelSchema),
});

export const PatchMonitoringPointResponseSchema = Type.Intersect([
  Type.Pick(MonitoringPointSchema, ['id', 'uuid', 'name', 'updatedAt']),
  Type.Object({
    sensor: Type.Optional(Type.Object({ uuid: Type.String(), model: SensorModelSchema })),
  }),
]);

// Types

export type MonitoringPointSortBy = Static<typeof MonitoringPointSortBySchema>;
export type MonitoringPointsQuery = Static<typeof MonitoringPointsQuerySchema>;
export type CreateMonitoringPointRequest = Static<typeof CreateMonitoringPointRequestSchema>;
export type MonitoringPoint = Static<typeof MonitoringPointSchema>;
export type MonitoringPointWithSensor = Static<typeof MonitoringPointWithSensorSchema>;
export type MonitoringPointWithMachineAndSensor = Static<typeof MonitoringPointWithMachineAndSensorSchema>;
export type PaginatedMonitoringPointsListResponse = Static<typeof PaginatedMonitoringPointsListResponseSchema>;
export type CreateMonitoringPointResponse = Static<typeof CreateMonitoringPointResponseSchema>;
export type PatchMonitoringPointRequest = Static<typeof PatchMonitoringPointRequestSchema>;
export type PatchMonitoringPointResponse = Static<typeof PatchMonitoringPointResponseSchema>;
