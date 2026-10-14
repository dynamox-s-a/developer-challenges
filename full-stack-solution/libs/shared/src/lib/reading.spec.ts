import {
  MAX_READINGS_PER_BATCH,
  createReadingsSchema,
  readingsMetricsQuerySchema,
  readingsRangeQuerySchema,
} from "./reading";

const reading = {
  timestamp: "2026-01-01T00:00:00.000Z",
  value: 1.5,
  metric: "temperature" as const,
};

describe("createReadingsSchema", () => {
  it("accepts a batch of readings", () => {
    expect(createReadingsSchema.parse({ readings: [reading] })).toEqual({
      readings: [reading],
    });
  });

  it("accepts a timestamp with a time zone offset", () => {
    const result = createReadingsSchema.safeParse({
      readings: [{ ...reading, timestamp: "2026-01-01T00:00:00-03:00" }],
    });

    expect(result.success).toBe(true);
  });

  it("accepts the largest allowed batch and rejects one more", () => {
    const batch = (size: number) => ({
      readings: Array.from({ length: size }, () => reading),
    });

    expect(
      createReadingsSchema.safeParse(batch(MAX_READINGS_PER_BATCH)).success,
    ).toBe(true);
    expect(
      createReadingsSchema.safeParse(batch(MAX_READINGS_PER_BATCH + 1)).success,
    ).toBe(false);
  });

  it.each([
    ["an empty batch", { readings: [] }],
    ["a missing batch", {}],
    ["a timestamp without time zone", [{ ...reading, timestamp: "2026-01-01T00:00:00" }]],
    ["a date without time", [{ ...reading, timestamp: "2026-01-01" }]],
    ["an impossible date", [{ ...reading, timestamp: "2026-02-30T00:00:00Z" }]],
    ["a numeric timestamp", [{ ...reading, timestamp: 1767225600000 }]],
    ["a value sent as text", [{ ...reading, value: "1.5" }]],
    ["a missing value", [{ timestamp: reading.timestamp }]],
    ["a null value", [{ ...reading, value: null }]],
  ])("rejects %s", (_label, input) => {
    const body = Array.isArray(input) ? { readings: input } : input;

    expect(createReadingsSchema.safeParse(body).success).toBe(false);
  });
});

describe("readingsRangeQuerySchema", () => {
  it("leaves both bounds open by default", () => {
    expect(readingsRangeQuerySchema.parse({})).toEqual({});
  });

  it("accepts a range, including a single instant", () => {
    const from = "2026-01-01T00:00:00Z";

    expect(
      readingsRangeQuerySchema.safeParse({ from, to: "2026-01-02T00:00:00Z" })
        .success,
    ).toBe(true);
    expect(readingsRangeQuerySchema.safeParse({ from, to: from }).success).toBe(
      true,
    );
  });

  it("compares the bounds as instants, not as text", () => {
    const result = readingsRangeQuerySchema.safeParse({
      from: "2026-01-01T02:00:00+03:00",
      to: "2026-01-01T00:00:00Z",
    });

    expect(result.success).toBe(true);
  });

  it.each([
    { from: "2026-01-02T00:00:00Z", to: "2026-01-01T00:00:00Z" },
    { from: "yesterday" },
    { to: "2026-01-01" },
  ])("rejects %p", (query) => {
    expect(readingsRangeQuerySchema.safeParse(query).success).toBe(false);
  });
});

describe("readingSchema metric", () => {
  it("rejects a reading without a metric", () => {
    // A sample whose quantity is unknown cannot be charted against an axis,
    // and guessing one would misrepresent the data.
    const result = createReadingsSchema.safeParse({
      readings: [{ timestamp: reading.timestamp, value: 1 }],
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["readings", 0, "metric"]);
  });

  it("rejects a quantity the system does not store", () => {
    const result = createReadingsSchema.safeParse({
      readings: [{ ...reading, metric: "pressure" }],
    });

    expect(result.success).toBe(false);
  });

  it("accepts every supported quantity", () => {
    for (const metric of [
      "temperature",
      "vibrationVelocityRms",
      "vibrationAccelerationRms",
    ]) {
      expect(
        createReadingsSchema.safeParse({ readings: [{ ...reading, metric }] })
          .success,
      ).toBe(true);
    }
  });
});

describe("readingsMetricsQuerySchema", () => {
  it("requires a metric, unlike the range query", () => {
    expect(readingsRangeQuerySchema.safeParse({}).success).toBe(true);
    expect(readingsMetricsQuerySchema.safeParse({}).success).toBe(false);
  });

  it("accepts a metric with an optional range", () => {
    const result = readingsMetricsQuerySchema.safeParse({
      metric: "vibrationVelocityRms",
      from: "2026-01-01T00:00:00Z",
    });

    expect(result.success).toBe(true);
  });

  it("still rejects an inverted range", () => {
    const result = readingsMetricsQuerySchema.safeParse({
      metric: "temperature",
      from: "2026-01-02T00:00:00Z",
      to: "2026-01-01T00:00:00Z",
    });

    expect(result.success).toBe(false);
  });
});
