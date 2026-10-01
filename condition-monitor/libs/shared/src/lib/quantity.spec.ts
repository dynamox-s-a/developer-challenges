import { isAxis, isAxisValidFor, isQuantity, seriesLabel, unitOf } from './quantity.js';

describe('quantities and axes', () => {
  it('gives each quantity a fixed unit', () => {
    expect(unitOf('acceleration_rms')).toBe('g');
    expect(unitOf('velocity_rms')).toBe('mm/s');
    expect(unitOf('temperature')).toBe('°C');
  });

  it('requires an axis for vibration', () => {
    expect(isAxisValidFor('velocity_rms', 'H')).toBe(true);
    expect(isAxisValidFor('velocity_rms', null)).toBe(false);
  });

  it('forbids an axis for temperature', () => {
    expect(isAxisValidFor('temperature', null)).toBe(true);
    expect(isAxisValidFor('temperature', 'A')).toBe(false);
  });

  it('builds the display name of a series', () => {
    expect(seriesLabel('velocity_rms', 'H')).toBe('Velocity RMS, horizontal');
    expect(seriesLabel('acceleration_rms', 'A')).toBe('Acceleration RMS, axial');
    expect(seriesLabel('temperature', null)).toBe('Temperature');
  });

  it('recognises only the closed lists', () => {
    expect(isQuantity('velocity_rms')).toBe(true);
    expect(isQuantity('velocity_peak')).toBe(false);
    expect(isAxis('V')).toBe(true);
    expect(isAxis('X')).toBe(false);
  });
});
