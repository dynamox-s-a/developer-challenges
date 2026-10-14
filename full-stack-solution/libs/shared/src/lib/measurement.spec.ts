import {
  MEASUREMENT_METRICS,
  METRIC_LABELS,
  METRIC_UNITS,
  measurementMetricSchema,
  metricWithUnit,
} from "./measurement";

describe("measurement metrics", () => {
  it("covers the three continuous telemetry quantities the platform charts", () => {
    expect(MEASUREMENT_METRICS).toEqual([
      "temperature",
      "vibrationAccelerationRms",
      "vibrationVelocityRms",
    ]);
  });

  it("is declared alphabetically, which PostgreSQL enum ordering relies on", () => {
    expect([...MEASUREMENT_METRICS]).toEqual([...MEASUREMENT_METRICS].sort());
  });

  it("gives every metric a unit and a label", () => {
    for (const metric of MEASUREMENT_METRICS) {
      expect(METRIC_UNITS[metric]).toBeTruthy();
      expect(METRIC_LABELS[metric]).toBeTruthy();
    }
  });

  it("uses the units the quantities are reported in", () => {
    expect(METRIC_UNITS.temperature).toBe("°C");
    expect(METRIC_UNITS.vibrationVelocityRms).toBe("mm/s");
    expect(METRIC_UNITS.vibrationAccelerationRms).toBe("m/s²");
  });

  it("formats an axis label as label plus unit", () => {
    expect(metricWithUnit("temperature")).toBe("Temperature (°C)");
    expect(metricWithUnit("vibrationVelocityRms")).toBe(
      "Vibration velocity RMS (mm/s)",
    );
  });

  it("is a closed set", () => {
    expect(measurementMetricSchema.safeParse("displacement").success).toBe(false);
  });
});
