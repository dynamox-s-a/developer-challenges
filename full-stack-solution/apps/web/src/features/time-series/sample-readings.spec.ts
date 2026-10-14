import { describe, expect, it } from "vitest";
import {
  MEASUREMENT_METRICS,
  createReadingsSchema,
} from "@full-stack-solution/shared";
import { generateSampleReadings } from "./sample-readings";

describe("generateSampleReadings", () => {
  it("produces readings the API schema accepts", () => {
    const readings = generateSampleReadings(10);

    expect(createReadingsSchema.safeParse({ readings }).success).toBe(true);
  });

  it("emits one sample per minute in ascending order, ending at the given time", () => {
    const endingAt = new Date("2026-01-01T12:00:00.000Z");
    const readings = generateSampleReadings(3, "temperature", endingAt);

    expect(readings.map((reading) => reading.timestamp)).toEqual([
      "2026-01-01T11:58:00.000Z",
      "2026-01-01T11:59:00.000Z",
      "2026-01-01T12:00:00.000Z",
    ]);
  });

  it("tags every sample with the requested quantity", () => {
    for (const metric of MEASUREMENT_METRICS) {
      const readings = generateSampleReadings(5, metric);

      expect(readings.every((reading) => reading.metric === metric)).toBe(true);
      expect(createReadingsSchema.safeParse({ readings }).success).toBe(true);
    }
  });

  it("keeps each quantity inside a plausible band for it", () => {
    const temperature = generateSampleReadings(50, "temperature");
    const velocity = generateSampleReadings(50, "vibrationVelocityRms");

    // A temperature in °C and a velocity in mm/s do not share a range, so the
    // generator must not hand out the same numbers for both.
    expect(Math.min(...temperature.map((r) => r.value))).toBeGreaterThan(35);
    expect(Math.max(...velocity.map((r) => r.value))).toBeLessThan(10);
  });
});
