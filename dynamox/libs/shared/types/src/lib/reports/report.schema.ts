/**
 * @fileoverview Reports schemas shared between API and Web App.
 * Defines runtime validation schemas and derived TypeScript types
 * for reports request/response contracts.
 */
import { Type, Static } from '@sinclair/typebox';
import { MachineTypeSchema } from '../machines/machine.schema.js';
import { SensorModelSchema } from '../sensors/sensor.schema.js';

// Response Schemas

export const DashboardMetricsSchema = Type.Object({
  machineCount: Type.Number(),
  monitoringPointCount: Type.Number(),
  assignedSensorCount: Type.Number(),
  timeSeriesRecordCount: Type.Number(),
  machinesByType: Type.Array(
    Type.Object({
      type: MachineTypeSchema,
      _count: Type.Object({ type: Type.Number() }),
    }),
  ),
  sensorDistribution: Type.Array(
    Type.Object({
      model: SensorModelSchema,
      _count: Type.Object({ model: Type.Number() }),
    }),
  ),
});


// Types

export type DashboardMetrics = Static<typeof DashboardMetricsSchema>;
