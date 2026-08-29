import { describe, expect, it } from "vitest";
import { MAX_CSV_SAMPLES, parseSensorCsv } from "./csv";

describe("parseSensorCsv", () => {
  it("parses the exact header and normalizes timestamps", () => {
    const samples = parseSensorCsv(
      "timestamp,x,y,z\n2026-08-24T12:00:00Z,1,2,3\n2026-08-24T12:00:01Z,4,5,6"
    );

    expect(samples).toEqual([
      {
        timestamp: "2026-08-24T12:00:00.000Z",
        x: 1,
        y: 2,
        z: 3,
      },
      {
        timestamp: "2026-08-24T12:00:01.000Z",
        x: 4,
        y: 5,
        z: 6,
      },
    ]);
  });

  it("handles a byte-order mark, quoted cells, and blank lines", () => {
    const [sample] = parseSensorCsv(
      '\uFEFFtimestamp,x,y,z\r\n"2026-08-24T12:00:00Z","1.5",2,3\r\n\r\n'
    );

    expect(sample?.x).toBe(1.5);
  });

  it("sorts timestamps and rejects duplicate normalized instants", () => {
    const samples = parseSensorCsv(
      "timestamp,x,y,z\n2026-08-24T12:00:01Z,1,2,3\n2026-08-24T12:00:00Z,4,5,6"
    );
    expect(samples.map((sample) => sample.timestamp)).toEqual([
      "2026-08-24T12:00:00.000Z",
      "2026-08-24T12:00:01.000Z",
    ]);

    expect(() =>
      parseSensorCsv("timestamp,x,y,z\n2026-08-24T12:00:00Z,1,2,3\n2026-08-24T09:00:00-03:00,4,5,6")
    ).toThrow("duplicates timestamp");
  });

  it("requires timestamps to include a timezone", () => {
    expect(() => parseSensorCsv("timestamp,x,y,z\n2026-08-24T12:00:00,1,2,3")).toThrow(
      "with a timezone"
    );
  });

  it.each([
    "z,timestamp,x,y\n3,2026-08-24T12:00:00Z,1,2",
    "Timestamp,x,y,z\n2026-08-24T12:00:00Z,1,2,3",
    "timestamp,x,y,z,unit\n2026-08-24T12:00:00Z,1,2,3,g",
    "timestamp, x,y,z\n2026-08-24T12:00:00Z,1,2,3",
  ])("requires the exact four-column header", (source) => {
    expect(() => parseSensorCsv(source)).toThrow("exactly timestamp,x,y,z");
  });

  it.each([
    ["timestamp,x,y,z\n2026-08-24T12:00:00Z,1,2,3,4", "exactly four columns"],
    ["timestamp,x,y,z\nnot-a-date,1,2,3", "invalid timestamp"],
    ["timestamp,x,y,z\n2026-08-24T12:00:00Z,nope,2,3", "invalid x"],
    ["timestamp,x,y,z\n2026-08-24T12:00:00Z,0x10,2,3", "invalid x"],
    ["timestamp,x,y,z\n2026-08-24T12:00:00Z,1,,3", "missing y"],
    ["timestamp,x,y,z\n2026-08-24T12:00:00Z,1,   ,3", "missing y"],
  ])("rejects invalid input", (source, message) => {
    expect(() => parseSensorCsv(source)).toThrow(message);
  });

  it("rejects payloads above the sample limit", () => {
    const rows = Array.from(
      { length: MAX_CSV_SAMPLES + 1 },
      (_, index) => `2026-08-24T12:00:00Z,${index},2,3`
    );

    expect(() => parseSensorCsv(`timestamp,x,y,z\n${rows.join("\n")}`)).toThrow(
      "the maximum is 10,000"
    );
  });
});
