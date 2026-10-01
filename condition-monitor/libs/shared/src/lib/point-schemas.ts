import { z } from 'zod';
import type { MachineType } from './machine.js';
import type { Machine } from './machine-schemas.js';
import {
  FAN_LOCATIONS,
  isRepeatableLocation,
  OTHER_LOCATION,
  PUMP_LOCATIONS,
  type Location,
} from './location.js';
import { paginationQuerySchema } from './pagination.js';
import { SENSOR_MODELS, type SensorModel } from './sensor.js';

export const POINT_NAME_MAX_LENGTH = 100;

const ALL_LOCATION_CODES: Location[] = [
  ...PUMP_LOCATIONS.map((location) => location.code),
  ...FAN_LOCATIONS.map((location) => location.code),
  OTHER_LOCATION.code,
];

/**
 * Every position of both types, in power-flow order. Whether it fits the machine is
 * checked by the API (B11). Zod needs a non-empty tuple, which this list always is.
 */
export const LOCATION_CODES = ALL_LOCATION_CODES as [Location, ...Location[]];

export const locationSchema = z.enum(LOCATION_CODES, { error: 'Must be a known position.' });

/** Free text that may repeat (assumption B2): the position identifies the point. */
export const pointNameSchema = z
  .string()
  .trim()
  .min(1, 'Required.')
  .max(POINT_NAME_MAX_LENGTH, `Must be at most ${POINT_NAME_MAX_LENGTH} characters.`);

/**
 * Body of `POST /api/machines/:id/monitoring-points`: the positions selected at once. A
 * missing name defaults to the position label (B12). The same position twice in one
 * request is refused here; a position already on the machine is refused by the API.
 */
export const createPositionsSchema = z.object({
  positions: z
    .array(z.object({ location: locationSchema, name: pointNameSchema.optional() }))
    .min(1, 'Select at least one position.')
    .superRefine((positions, context) => {
      const seen = new Set<Location>();
      positions.forEach((position, index) => {
        if (isRepeatableLocation(position.location)) return;
        if (seen.has(position.location)) {
          context.addIssue({
            code: 'custom',
            path: [index, 'location'],
            message: 'This position is selected twice.',
          });
        }
        seen.add(position.location);
      });
    }),
});

/** Body of `PATCH /api/monitoring-points/:id`: any subset, but at least one field. */
export const updatePointSchema = z
  .object({ name: pointNameSchema, location: locationSchema })
  .partial()
  .refine((body) => body.name !== undefined || body.location !== undefined, {
    message: 'Send at least one field to change.',
  });

/**
 * A serial number as printed on the sensor label (B4): trimmed and uppercased, so
 * `dx-0012` and `DX-0012` are one sensor, then 3 to 40 letters, digits or hyphens. The
 * database checks the same format.
 */
export const serialNumberSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9-]{3,40}$/, 'Must be 3 to 40 letters, digits or hyphens.');

export const sensorModelSchema = z.enum(SENSOR_MODELS, {
  error: `Must be one of: ${SENSOR_MODELS.join(', ')}.`,
});

/** Body of `PUT /api/monitoring-points/:id/sensor`: installs or replaces (B14). */
export const installSensorSchema = z.object({
  serialNumber: serialNumberSchema,
  model: sensorModelSchema,
});

export const POINT_SORT_KEYS = [
  'machineName',
  'machineType',
  'monitoringPointName',
  'sensorModel',
  'machineTag',
  'location',
] as const;
export type PointSortKey = (typeof POINT_SORT_KEYS)[number];

/** Query of `GET /api/monitoring-points`: 5 per page, as the challenge asks. */
export const listPointsQuerySchema = paginationQuerySchema({
  sortKeys: POINT_SORT_KEYS,
  defaultSort: 'machineName',
  defaultPageSize: 5,
});

export type CreatePositionsRequest = z.infer<typeof createPositionsSchema>;
export type UpdatePointRequest = z.infer<typeof updatePointSchema>;
export type InstallSensorRequest = z.infer<typeof installSensorSchema>;
export type ListPointsQuery = z.infer<typeof listPointsQuerySchema>;

export interface InstalledSensor {
  serialNumber: string;
  model: SensorModel;
}

/** A monitoring point as the API answers it; `sensor` is null when none is installed. */
export interface MonitoringPoint {
  id: string;
  name: string;
  location: Location;
  machine: { id: string; tag: string; name: string; type: MachineType };
  sensor: InstalledSensor | null;
}

/** What deleting a machine takes with it, shown before confirming (B6). */
export interface MachineCounts {
  monitoringPoints: number;
  sensors: number;
}

/** Answer of `GET /api/machines/:id`: the machine, its points and what deleting it removes. */
export interface MachineDetail extends Machine {
  monitoringPoints: MonitoringPoint[];
  counts: MachineCounts;
}

/**
 * Query of `GET /api/sensors`: optional serial numbers, one or several, as a URL repeats
 * a parameter (`?serialNumber=A&serialNumber=B`). None means every installed sensor.
 */
export const listSensorsQuerySchema = z.object({
  serialNumber: z
    .preprocess(
      (value) => (value === undefined || Array.isArray(value) ? value : [value]),
      z.array(serialNumberSchema).max(1000, 'At most 1,000 serial numbers.'),
    )
    .optional(),
});

export type ListSensorsQuery = z.infer<typeof listSensorsQuerySchema>;

/** An installed sensor and where it is, as the simulator discovers it (C13). */
export interface SensorInstallation {
  serialNumber: string;
  model: SensorModel;
  monitoringPointId: string;
  location: Location;
  machineTag: string;
  machineType: MachineType;
}
