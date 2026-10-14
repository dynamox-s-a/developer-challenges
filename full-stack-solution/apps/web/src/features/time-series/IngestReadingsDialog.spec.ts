import { describe, expect, it } from "vitest";
import { parseReadingsPayload } from "./IngestReadingsDialog";
import { generateSampleReadings } from "./sample-readings";

describe("parseReadingsPayload", () => {
  it("accepts the { readings } envelope", () => {
    const readings = generateSampleReadings(2);

    const result = parseReadingsPayload(JSON.stringify({ readings }));

    expect(result).toEqual({ ok: true, data: { readings } });
  });

  it("accepts a bare array", () => {
    const readings = generateSampleReadings(2);

    const result = parseReadingsPayload(JSON.stringify(readings));

    expect(result).toEqual({ ok: true, data: { readings } });
  });

  it("rejects malformed JSON", () => {
    expect(parseReadingsPayload("{ nope")).toEqual({
      ok: false,
      message: "The payload is not valid JSON.",
    });
  });

  it("rejects an empty batch", () => {
    const result = parseReadingsPayload("[]");

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.message).toContain(
      "Send at least one reading",
    );
  });

  it("rejects a timestamp without a time zone", () => {
    const result = parseReadingsPayload(
      JSON.stringify([{ timestamp: "2026-01-01T00:00:00", value: 1 }]),
    );

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.message).toContain("readings.0.timestamp");
  });

  it("rejects a non-numeric value", () => {
    const result = parseReadingsPayload(
      JSON.stringify([{ timestamp: "2026-01-01T00:00:00Z", value: "warm" }]),
    );

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.message).toContain("readings.0.value");
  });
});
