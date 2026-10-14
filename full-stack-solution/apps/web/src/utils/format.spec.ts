import { describe, expect, it } from "vitest";
import { formatAxisTimestamp, formatNumber, formatTimestamp } from "./format";

describe("formatNumber", () => {
  it("renders a dash for missing values", () => {
    expect(formatNumber(null)).toBe("—");
    expect(formatNumber(undefined)).toBe("—");
    expect(formatNumber(Number.NaN)).toBe("—");
  });

  it("keeps zero instead of treating it as missing", () => {
    expect(formatNumber(0)).toBe("0");
  });

  it("limits the number of decimals", () => {
    // Compared against `toLocaleString` so the test does not depend on the
    // decimal separator of the machine running it.
    expect(formatNumber(1.23456, 2)).toBe((1.23).toLocaleString());
    expect(formatNumber(1.9, 0)).toBe("2");
  });
});

describe("formatTimestamp", () => {
  it("renders a dash for missing or invalid input", () => {
    expect(formatTimestamp(null)).toBe("—");
    expect(formatTimestamp("not-a-date")).toBe("—");
  });

  it("formats a valid ISO timestamp", () => {
    expect(formatTimestamp("2026-01-01T00:00:00.000Z")).not.toBe("—");
  });
});

describe("formatAxisTimestamp", () => {
  const at = (iso: string) => Date.parse(iso);
  const MINUTE = 60_000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;

  it("shows seconds on a window of less than two minutes", () => {
    const label = formatAxisTimestamp(at("2026-01-01T13:45:30Z"), 90_000);

    // Two colons means hh:mm:ss.
    expect(label.match(/:/g)).toHaveLength(2);
  });

  it("shows the time of day within a couple of days", () => {
    const label = formatAxisTimestamp(at("2026-01-01T13:45:30Z"), 6 * HOUR);

    expect(label.match(/:/g)).toHaveLength(1);
  });

  it("switches to day and month once the window spans more than two days", () => {
    const label = formatAxisTimestamp(at("2026-03-09T13:45:00Z"), 30 * DAY);

    // A date label, not a clock reading: repeating the time of day over a
    // month-long window carries no information.
    expect(label).not.toMatch(/:/);
    expect(label).toMatch(/\d/);
  });

  it("switches to month and year beyond six months", () => {
    const label = formatAxisTimestamp(at("2026-03-09T13:45:00Z"), 300 * DAY);

    expect(label).toMatch(/2026/);
    expect(label).not.toMatch(/:/);
  });

  it("shows only the year beyond three years", () => {
    const label = formatAxisTimestamp(at("2026-03-09T13:45:00Z"), 5 * 365 * DAY);

    expect(label).toBe(new Date(at("2026-03-09T13:45:00Z")).toLocaleDateString(undefined, { year: "numeric" }));
  });

  it("renders a dash for an invalid instant", () => {
    expect(formatAxisTimestamp(Number.NaN, HOUR)).toBe("—");
  });
});
