/**
 * @fileoverview Sensor schemas shared between API and Web App.
 * Defines runtime validation schemas and derived TypeScript types
 * for Sensor request/response contracts.
 */
import { Type, Static } from '@sinclair/typebox';

// Shared Schemas

export const SensorModelSchema = Type.Union([
  Type.Literal('TcAg'),
  Type.Literal('TcAs'),
  Type.Literal('HFPlus'),
]);

// Model Schemas

export const SensorSchema = Type.Object({
  id: Type.Number(),
  uuid: Type.String(),
  model: SensorModelSchema,
  monitoringPointId: Type.Number(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

// Types

export type SensorModel = Static<typeof SensorModelSchema>;
export type Sensor = Static<typeof SensorSchema>;
