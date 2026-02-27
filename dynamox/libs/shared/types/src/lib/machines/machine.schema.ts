/**
 * @fileoverview Machine schemas shared between API and Web App.
 * Defines runtime validation schemas and derived TypeScript types
 * for Machine request/response contracts.
 */
import { Type, Static } from '@sinclair/typebox';
import { MonitoringPointWithSensorSchema } from '../monitoring-points/monitoring-point.schema.js';

// Shared Schemas

export const MachineTypeSchema = Type.Union([
  Type.Literal('Pump'),
  Type.Literal('Fan'),
]);

// Params Schemas

export const MachineParamsSchema = Type.Object({
  uuid: Type.String({ format: 'uuid' }),
});

// Model Schemas

export const MachineSchema = Type.Object({
  id: Type.Number(),
  uuid: Type.String(),
  name: Type.String({ minLength: 1 }),
  type: MachineTypeSchema,
  userId: Type.Number(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export const MachinesListResponseSchema = Type.Object({
  machines: Type.Array(
    Type.Intersect([
      MachineSchema,
      Type.Object({
        monitoringPoints: Type.Array(MonitoringPointWithSensorSchema),
        unassignedSensorCount: Type.Number({ description: 'Number of monitoring points without an associated sensor' }),
      }),
    ]),
  ),
});

// Body Schemas

export const CreateMachineRequestSchema = Type.Object({
  name: Type.String({ minLength: 1, description: 'Machine name' }),
  type: MachineTypeSchema,
});

export const CreateMachineResponseSchema = Type.Pick(MachineSchema, ['id', 'uuid', 'name', 'type', 'createdAt']);

export const PatchMachineRequestSchema = Type.Partial(
  Type.Pick(MachineSchema, ['name', 'type']),
);

export const PatchMachineResponseSchema = Type.Pick(MachineSchema, ['id', 'uuid', 'name', 'type', 'updatedAt']);

// Types

export type MachineType = Static<typeof MachineTypeSchema>;
export type MachineParams = Static<typeof MachineParamsSchema>;
export type Machine = Static<typeof MachineSchema>;
export type MachinesListResponse = Static<typeof MachinesListResponseSchema>;
export type CreateMachineRequest = Static<typeof CreateMachineRequestSchema>;
export type CreateMachineResponse = Static<typeof CreateMachineResponseSchema>;
export type PatchMachineRequest = Static<typeof PatchMachineRequestSchema>;
export type PatchMachineResponse = Static<typeof PatchMachineResponseSchema>;
