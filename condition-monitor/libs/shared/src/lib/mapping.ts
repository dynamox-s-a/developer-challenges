import type { MachineType } from './machine.js';
import type { Quantity } from './quantity.js';
import type { SensorModel } from './sensor.js';

/**
 * A two-way mapping between the values the API exposes and the enum values the database
 * stores. `HF+` is not a valid enum identifier, so the two vocabularies differ, and the
 * conversion lives only here (domain model, "Value mapping").
 */
export interface EnumMapping<Api extends string, Db extends string> {
  toDb(value: Api): Db;
  fromDb(value: Db): Api;
}

function createEnumMapping<Api extends string, Db extends string>(
  name: string,
  pairs: Record<Api, Db>,
): EnumMapping<Api, Db> {
  const reverse = new Map<string, Api>();
  for (const [api, db] of Object.entries(pairs) as [Api, Db][]) {
    if (reverse.has(db)) {
      throw new Error(`Duplicate database value for ${name}: ${db}`);
    }
    reverse.set(db, api);
  }
  return {
    toDb(value) {
      const db = pairs[value];
      if (db === undefined) {
        throw new Error(`Unknown ${name}: ${value}`);
      }
      return db;
    },
    fromDb(value) {
      const api = reverse.get(value);
      if (api === undefined) {
        throw new Error(`Unknown database value for ${name}: ${value}`);
      }
      return api;
    },
  };
}

export type DbMachineType = 'PUMP' | 'FAN';
export type DbSensorModel = 'TC_AG' | 'TC_AS' | 'HF_PLUS';
export type DbQuantity = 'ACCELERATION_RMS' | 'VELOCITY_RMS' | 'TEMPERATURE';

export const machineTypeMapping = createEnumMapping<MachineType, DbMachineType>('machine type', {
  Pump: 'PUMP',
  Fan: 'FAN',
});

export const sensorModelMapping = createEnumMapping<SensorModel, DbSensorModel>('sensor model', {
  TcAg: 'TC_AG',
  TcAs: 'TC_AS',
  'HF+': 'HF_PLUS',
});

export const quantityMapping = createEnumMapping<Quantity, DbQuantity>('quantity', {
  acceleration_rms: 'ACCELERATION_RMS',
  velocity_rms: 'VELOCITY_RMS',
  temperature: 'TEMPERATURE',
});
