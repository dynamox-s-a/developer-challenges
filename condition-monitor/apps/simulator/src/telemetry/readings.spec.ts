import { readingSchema } from '@condition-monitor/shared';
import { SERIES, sensorReadings } from './readings';

describe('sensorReadings', () => {
  const times = [Date.UTC(2026, 8, 29, 10, 0), Date.UTC(2026, 8, 29, 10, 10)];
  const readings = sensorReadings({ serialNumber: 'DX-0001', machineType: 'Pump' }, times, 1);

  it('produces the seven series of every sensor at each instant (C13)', () => {
    expect(SERIES).toEqual([
      { quantity: 'acceleration_rms', axis: 'H' },
      { quantity: 'acceleration_rms', axis: 'V' },
      { quantity: 'acceleration_rms', axis: 'A' },
      { quantity: 'velocity_rms', axis: 'H' },
      { quantity: 'velocity_rms', axis: 'V' },
      { quantity: 'velocity_rms', axis: 'A' },
      { quantity: 'temperature', axis: null },
    ]);
    expect(readings).toHaveLength(14);
    expect(readings[0].timestamp).toBe('2026-09-29T10:00:00.000Z');
    expect(readings[7].timestamp).toBe('2026-09-29T10:10:00.000Z');
  });

  it('writes readings the API accepts, checked with the shared schema', () => {
    for (const reading of readings) {
      expect(readingSchema.parse(reading)).toEqual(reading);
    }
  });
});
