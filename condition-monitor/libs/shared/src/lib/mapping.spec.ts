import { MACHINE_TYPES } from './machine.js';
import {
  machineTypeMapping,
  quantityMapping,
  sensorModelMapping,
  type DbSensorModel,
} from './mapping.js';
import { QUANTITY_CODES } from './quantity.js';
import { SENSOR_MODELS, type SensorModel } from './sensor.js';

describe('API and database value mapping', () => {
  it('maps HF+ to a valid enum identifier and back', () => {
    expect(sensorModelMapping.toDb('HF+')).toBe('HF_PLUS');
    expect(sensorModelMapping.fromDb('HF_PLUS')).toBe('HF+');
  });

  it('round-trips every value of every list', () => {
    for (const type of MACHINE_TYPES) {
      expect(machineTypeMapping.fromDb(machineTypeMapping.toDb(type))).toBe(type);
    }
    for (const model of SENSOR_MODELS) {
      expect(sensorModelMapping.fromDb(sensorModelMapping.toDb(model))).toBe(model);
    }
    for (const quantity of QUANTITY_CODES) {
      expect(quantityMapping.fromDb(quantityMapping.toDb(quantity))).toBe(quantity);
    }
  });

  it('refuses unknown values in both directions', () => {
    expect(() => sensorModelMapping.toDb('HF' as SensorModel)).toThrow('Unknown sensor model');
    expect(() => sensorModelMapping.fromDb('HF' as DbSensorModel)).toThrow(
      'Unknown database value for sensor model',
    );
  });
});
