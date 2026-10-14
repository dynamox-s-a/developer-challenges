import { z } from "zod";

/**
 * Physical quantities a monitoring point can report.
 *
 * Scope: the three continuous telemetry quantities the DynaPredict platform
 * charts ("Histórico de Velocidade RMS, Temperatura e Aceleração RMS").
 * Spectral data, frequency bands and per-axis (X/Y/Z) breakdowns are out of
 * scope — this system stores raw scalar samples, not signal analysis.
 *
 * Declared alphabetically: PostgreSQL sorts enums by declaration order, and
 * the rest of the schema relies on that matching alphabetical order.
 */
export const MEASUREMENT_METRICS = [
  "temperature",
  "vibrationAccelerationRms",
  "vibrationVelocityRms",
] as const;

export const measurementMetricSchema = z.enum(MEASUREMENT_METRICS);
export type MeasurementMetric = z.infer<typeof measurementMetricSchema>;

/**
 * Unit of each quantity.
 *
 * The unit is **derived** from the metric and never stored on a reading: a
 * stored unit would be a second source of truth, free to disagree with the
 * quantity it describes.
 *
 * `°C` is the unit the platform manual states for temperature. The vibration
 * units follow ISO 20816 (velocity in mm/s, acceleration in m/s²); the manual
 * names the quantities but does not print their units — see
 * `docs/12-assumptions.md`.
 */
export const METRIC_UNITS: Record<MeasurementMetric, string> = {
  temperature: "°C",
  vibrationAccelerationRms: "m/s²",
  vibrationVelocityRms: "mm/s",
};

/** Human-readable name, for axis labels, legends and tooltips. */
export const METRIC_LABELS: Record<MeasurementMetric, string> = {
  temperature: "Temperature",
  vibrationAccelerationRms: "Vibration acceleration RMS",
  vibrationVelocityRms: "Vibration velocity RMS",
};

/** `"Temperature (°C)"` — the axis label form. */
export function metricWithUnit(metric: MeasurementMetric): string {
  return `${METRIC_LABELS[metric]} (${METRIC_UNITS[metric]})`;
}
