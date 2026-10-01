import type { Axis, MachineType, Quantity } from '@condition-monitor/shared';
import { DECIMALS, DEGRADATION, PROFILES, VARIATION } from './profiles';

/** FNV-1a: a small, stable 32-bit hash of a text. */
function hash32(text: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** A number in [0, 1) fixed by the key: the first output of mulberry32 seeded with it. */
export function uniform(key: string): number {
  let state = (hash32(key) + 0x6d2b79f5) >>> 0;
  state = Math.imul(state ^ (state >>> 15), state | 1);
  state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
  return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
}

/** A standard normal number fixed by the key (Box-Muller over two uniforms). */
export function gaussian(key: string): number {
  // 1 - u keeps the logarithm away from zero.
  const radius = Math.sqrt(-2 * Math.log(1 - uniform(`${key}|r`)));
  return radius * Math.cos(2 * Math.PI * uniform(`${key}|a`));
}

/** The plant's daily cycle: -1 at 02:00 UTC, +1 at 14:00 UTC. */
export function dailyCycle(timestamp: number): number {
  const hours = (timestamp % 86_400_000) / 3_600_000;
  return Math.sin((2 * Math.PI * (hours - 8)) / 24);
}

export interface SignalInput {
  seed: number;
  serialNumber: string;
  machineType: MachineType;
  quantity: Quantity;
  axis: Axis | null;
  /** Milliseconds since the epoch. */
  timestamp: number;
  /** When set, the sensor degrades from this instant on. */
  degradingSince?: number | null;
}

/**
 * The value of one series at one instant (C13). It depends only on its inputs, never on
 * what was generated before: the same reading always has the same value, so a backfill
 * run twice, or overlapping the live mode, repeats readings instead of conflicting (C5).
 */
export function valueAt(input: SignalInput): number {
  const sensor = `${input.seed}|${input.serialNumber}|${input.quantity}`;
  const series = `${sensor}|${input.axis ?? ''}`;
  // Fixed per sensor and quantity, the same on the three axes: no two sensors sit at
  // exactly the same level, and each keeps the profile's proportions between axes.
  const offset = 2 * uniform(`${sensor}|offset`) - 1;
  const noise = gaussian(`${series}|${input.timestamp}`);
  const cycle = dailyCycle(input.timestamp);
  const profile = PROFILES[input.machineType];
  // Days of degradation at this instant; zero before it starts or without it.
  const days =
    input.degradingSince == null
      ? 0
      : Math.max(0, (input.timestamp - input.degradingSince) / 86_400_000);

  const value =
    input.quantity === 'temperature'
      ? profile.temperature +
        VARIATION.temperatureSpread * offset +
        VARIATION.dailyTemperature * cycle +
        VARIATION.temperatureNoise * noise +
        DEGRADATION.temperaturePerDay * days
      : profile.vibration[input.quantity][input.axis ?? 'H'] *
        (1 + VARIATION.sensorSpread * offset) *
        (1 + DEGRADATION.vibrationPerDay * days) *
        (1 + VARIATION.dailyLoad * cycle) *
        (1 + VARIATION.vibrationNoise * noise);

  // An RMS cannot be negative; at 4 % noise this would take a 25-sigma draw.
  const physical = input.quantity === 'temperature' ? value : Math.max(0, value);
  const scale = 10 ** DECIMALS[input.quantity];
  return Math.round(physical * scale) / scale;
}
