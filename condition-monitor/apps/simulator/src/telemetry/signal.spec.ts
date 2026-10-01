import { dailyCycle, gaussian, uniform, valueAt, type SignalInput } from './signal';
import { PROFILES } from './profiles';

const T0 = Date.UTC(2026, 8, 29);
const input: SignalInput = {
  seed: 1,
  serialNumber: 'DX-0001',
  machineType: 'Fan',
  quantity: 'velocity_rms',
  axis: 'H',
  timestamp: T0,
};

/** One day at 10 minutes. */
const day = Array.from({ length: 144 }, (_, index) => T0 + index * 600_000);
const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

describe('uniform and gaussian', () => {
  it('give the same number for the same key, and spread over their range', () => {
    expect(uniform('a')).toBe(uniform('a'));
    expect(uniform('a')).not.toBe(uniform('b'));

    const uniforms = Array.from({ length: 10_000 }, (_, index) => uniform(`k${index}`));
    expect(Math.min(...uniforms)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...uniforms)).toBeLessThan(1);
    expect(mean(uniforms)).toBeCloseTo(0.5, 1);

    const normals = Array.from({ length: 10_000 }, (_, index) => gaussian(`k${index}`));
    expect(mean(normals)).toBeCloseTo(0, 1);
    expect(Math.sqrt(mean(normals.map((value) => value * value)))).toBeCloseTo(1, 1);
  });
});

describe('dailyCycle', () => {
  it('is lowest at 02:00 UTC and highest at 14:00 UTC', () => {
    expect(dailyCycle(T0 + 2 * 3_600_000)).toBeCloseTo(-1, 10);
    expect(dailyCycle(T0 + 14 * 3_600_000)).toBeCloseTo(1, 10);
  });
});

describe('valueAt', () => {
  it('depends only on its inputs, so a reading generated twice has one value (C5)', () => {
    expect(valueAt(input)).toBe(valueAt({ ...input }));
    // Generating a day, or only its second half, gives the same values where they meet.
    const whole = day.map((timestamp) => valueAt({ ...input, timestamp }));
    const half = day.slice(72).map((timestamp) => valueAt({ ...input, timestamp }));
    expect(half).toEqual(whole.slice(72));
  });

  it('changes with the seed, the sensor and the instant', () => {
    const values = new Set([
      valueAt(input),
      valueAt({ ...input, seed: 2 }),
      valueAt({ ...input, serialNumber: 'DX-0002' }),
      valueAt({ ...input, timestamp: T0 + 600_000 }),
    ]);

    expect(values.size).toBe(4);
  });

  it('stays near the profile of each machine type, quantity and axis', () => {
    for (const machineType of ['Pump', 'Fan'] as const) {
      for (const quantity of ['acceleration_rms', 'velocity_rms'] as const) {
        for (const axis of ['H', 'V', 'A'] as const) {
          const values = day.map((timestamp) =>
            valueAt({ ...input, machineType, quantity, axis, timestamp }),
          );
          const level = PROFILES[machineType].vibration[quantity][axis];
          // Within the sensor spread of 20 %, and never negative.
          expect(mean(values)).toBeGreaterThan(level * 0.8);
          expect(mean(values)).toBeLessThan(level * 1.2);
          expect(Math.min(...values)).toBeGreaterThan(0);
        }
      }
      const temperatures = day.map((timestamp) =>
        valueAt({ ...input, machineType, quantity: 'temperature', axis: null, timestamp }),
      );
      expect(Math.abs(mean(temperatures) - PROFILES[machineType].temperature)).toBeLessThan(3.5);
    }
  });

  it('keeps the order of the axes of the profile for every sensor', () => {
    for (const serialNumber of ['DX-0001', 'DX-0002', 'DX-0003', 'DX-0004', 'DX-0005']) {
      const level = (axis: 'H' | 'V' | 'A') =>
        mean(day.map((timestamp) => valueAt({ ...input, serialNumber, axis, timestamp })));
      // A fan: horizontal above vertical above axial, as unbalance gives.
      expect(level('H')).toBeGreaterThan(level('V'));
      expect(level('V')).toBeGreaterThan(level('A'));
    }
  });

  it('follows the daily cycle: the afternoon is higher than the night', () => {
    const at = (hour: number) =>
      mean(
        Array.from({ length: 30 }, (_, dayIndex) =>
          valueAt({ ...input, timestamp: T0 + dayIndex * 86_400_000 + hour * 3_600_000 }),
        ),
      );

    expect(at(14)).toBeGreaterThan(at(2));
  });

  it('keeps 3 decimals for vibration and 1 for temperature', () => {
    for (const timestamp of day) {
      const vibration = valueAt({ ...input, timestamp });
      const temperature = valueAt({ ...input, quantity: 'temperature', axis: null, timestamp });
      expect(Math.round(vibration * 1000) / 1000).toBe(vibration);
      expect(Math.round(temperature * 10) / 10).toBe(temperature);
    }
  });

  describe('a degrading sensor', () => {
    const since = T0 + 10 * 86_400_000;
    const at = (dayOffset: number, extra: Partial<SignalInput> = {}) =>
      day.map((timestamp) =>
        valueAt({ ...input, ...extra, timestamp: timestamp + dayOffset * 86_400_000 }),
      );

    it('is the same as a healthy one until the degradation starts', () => {
      expect(at(9, { degradingSince: since })).toEqual(at(9));
    });

    it('rises 1.5 % of its level per day afterwards', () => {
      // Twenty days in: the level is 30 % higher, the noise being the same draw.
      const healthy = mean(at(30));
      const degraded = mean(at(30, { degradingSince: since }));

      expect(degraded / healthy).toBeGreaterThan(1.29);
      expect(degraded / healthy).toBeLessThan(1.32);
    });

    it('warms up by 0.1 °C per day', () => {
      const temperature = { quantity: 'temperature', axis: null } as const;
      const healthy = mean(at(30, temperature));
      const degraded = mean(at(30, { ...temperature, degradingSince: since }));

      expect(degraded - healthy).toBeGreaterThan(1.9);
      expect(degraded - healthy).toBeLessThan(2.2);
    });
  });
});
