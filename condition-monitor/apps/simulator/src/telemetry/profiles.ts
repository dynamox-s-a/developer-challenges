import type { Axis, MachineType, Quantity } from '@condition-monitor/shared';

/**
 * Typical levels of a healthy machine, per machine type, quantity and axis (C13). They
 * are synthetic: rounded orders of magnitude for small motor-driven sets in good
 * condition, not measurements of any machine. Edit them here to simulate other levels.
 */
export interface Profile {
  /** Vibration level, in the unit of its quantity (C10). */
  vibration: Record<'acceleration_rms' | 'velocity_rms', Record<Axis, number>>;
  /** Bearing housing temperature, °C. */
  temperature: number;
}

export const PROFILES: Record<MachineType, Profile> = {
  // A pump runs steadily; its impeller adds high-frequency content, hence acceleration.
  Pump: {
    vibration: {
      velocity_rms: { H: 2.2, V: 1.6, A: 1.2 },
      acceleration_rms: { H: 0.55, V: 0.45, A: 0.35 },
    },
    temperature: 48,
  },
  // A fan is dominated by unbalance: radial, strongest in the horizontal direction.
  Fan: {
    vibration: {
      velocity_rms: { H: 2.8, V: 2.0, A: 1.4 },
      acceleration_rms: { H: 0.4, V: 0.32, A: 0.25 },
    },
    temperature: 42,
  },
};

/** How much the values move, the same for every machine type. */
export const VARIATION = {
  /** Vibration follows the plant's load over the day, by this fraction up and down. */
  dailyLoad: 0.08,
  /** Random spread of vibration, as a fraction of the level (one standard deviation). */
  vibrationNoise: 0.04,
  /** Each sensor sits up to this fraction above or below the profile, for good. */
  sensorSpread: 0.2,
  /** Temperature swings this many degrees with the day. */
  dailyTemperature: 4,
  /** Random spread of temperature, °C (one standard deviation). */
  temperatureNoise: 0.4,
  /** Each sensor sits up to this many degrees above or below the profile, for good. */
  temperatureSpread: 3,
} as const;

/**
 * How a degrading sensor drifts (the `--degrade` option): a slow, steady rise, the kind
 * a trend forecast is meant to catch. Synthetic like the rest, not a fault model.
 */
export const DEGRADATION = {
  /** Vibration grows by this fraction of its level per day. */
  vibrationPerDay: 0.015,
  /** Temperature grows by this many degrees per day. */
  temperaturePerDay: 0.1,
} as const;

/** Decimals kept per quantity: finer than any sensor of this kind would report. */
export const DECIMALS: Record<Quantity, number> = {
  acceleration_rms: 3,
  velocity_rms: 3,
  temperature: 1,
};
