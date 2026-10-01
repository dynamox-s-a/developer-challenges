import {
  isLocation,
  isLocationAllowed,
  isRepeatableLocation,
  locationLabel,
  locationsFor,
  type Location,
} from './location.js';

describe('installation positions', () => {
  it('lists the five pump positions in power-flow order, OTHER last', () => {
    expect(locationsFor('Pump').map((option) => option.code)).toEqual([
      'PUMP_MOTOR_NDE',
      'PUMP_MOTOR_DE',
      'PUMP_COUPLING_SIDE',
      'PUMP_IMPELLER_SIDE',
      'PUMP_MECHANICAL_SEAL',
      'OTHER',
    ]);
  });

  it('lists the four fan positions in power-flow order, OTHER last', () => {
    expect(locationsFor('Fan').map((option) => option.code)).toEqual([
      'FAN_MOTOR_NDE',
      'FAN_MOTOR_DE',
      'FAN_SHAFT_DE',
      'FAN_SHAFT_NDE',
      'OTHER',
    ]);
  });

  it('accepts a position of the machine type', () => {
    expect(isLocationAllowed('Pump', 'PUMP_MECHANICAL_SEAL')).toBe(true);
    expect(isLocationAllowed('Fan', 'FAN_SHAFT_NDE')).toBe(true);
  });

  it('rejects a position of the other type', () => {
    expect(isLocationAllowed('Fan', 'PUMP_MECHANICAL_SEAL')).toBe(false);
    expect(isLocationAllowed('Pump', 'FAN_SHAFT_DE')).toBe(false);
  });

  it('accepts OTHER on both types, and only OTHER repeats', () => {
    expect(isLocationAllowed('Pump', 'OTHER')).toBe(true);
    expect(isLocationAllowed('Fan', 'OTHER')).toBe(true);
    expect(isRepeatableLocation('OTHER')).toBe(true);
    expect(isRepeatableLocation('PUMP_MOTOR_DE')).toBe(false);
  });

  it('labels a position, and refuses an unknown one', () => {
    expect(locationLabel('PUMP_IMPELLER_SIDE')).toBe('Pump, impeller side bearing');
    expect(() => locationLabel('PUMP_TAIL' as Location)).toThrow('Unknown location');
  });

  it('recognises only declared codes', () => {
    expect(isLocation('FAN_MOTOR_DE')).toBe(true);
    expect(isLocation('fan_motor_de')).toBe(false);
  });
});
