import type { MeasurementMetric, Reading } from "@full-stack-solution/shared";

/**
 * Plausible value band per quantity, used only to seed the ingest form.
 *
 * These are not measurements and are never presented as such: they exist so
 * the ingest flow can be exercised without a sensor in the field. `base` is the
 * centre of the band and `swing` the amplitude around it.
 */
const SAMPLE_BANDS: Record<MeasurementMetric, { base: number; swing: number }> =
  {
    temperature: { base: 45, swing: 5 },
    vibrationVelocityRms: { base: 2.8, swing: 1.2 },
    vibrationAccelerationRms: { base: 1.4, swing: 0.6 },
  };

/**
 * Builds a synthetic series for one quantity: a sine wave plus noise, one
 * sample per minute ending at `endingAt`.
 *
 * Timestamps are ISO 8601 with an explicit time zone (`toISOString` yields
 * `Z`), which is what the API requires.
 */
export function generateSampleReadings(
  count: number,
  metric: MeasurementMetric = "temperature",
  endingAt: Date = new Date(),
): Reading[] {
  const intervalMs = 60_000;
  const { base, swing } = SAMPLE_BANDS[metric];

  return Array.from({ length: count }, (_unused, index) => {
    const offset = (count - 1 - index) * intervalMs;
    const wave = Math.sin((index / Math.max(1, count)) * Math.PI * 4);

    return {
      timestamp: new Date(endingAt.getTime() - offset).toISOString(),
      value: Number((base + swing * wave + Math.random() * 0.1).toFixed(3)),
      metric,
    };
  });
}
