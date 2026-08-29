import { describe, expect, it } from "vitest";

import {
  createTimeSeriesRequestSchema,
  monitoringPointListQuerySchema,
  updateMachineRequestSchema,
} from "../src/index.js";

describe("shared API contracts", () => {
  it("defaults monitoring-point pagination and sort values", () => {
    expect(monitoringPointListQuerySchema.parse({})).toEqual({
      page: 1,
      sortBy: "monitoringPointName",
      sortOrder: "asc",
    });
  });

  it("accepts machine name and type updates but requires at least one field", () => {
    expect(updateMachineRequestSchema.safeParse({ name: "Renamed", type: "Fan" }).success).toBe(
      true
    );
    expect(updateMachineRequestSchema.safeParse({ type: "Pump" }).success).toBe(true);
    expect(updateMachineRequestSchema.safeParse({ name: "Renamed" }).success).toBe(true);
    expect(updateMachineRequestSchema.safeParse({}).success).toBe(false);
    expect(updateMachineRequestSchema.safeParse({ type: "Motor" }).success).toBe(false);
  });

  it("requires all three axes for every sample", () => {
    expect(
      createTimeSeriesRequestSchema.safeParse({
        samples: [
          {
            timestamp: "2026-08-24T12:00:00.000Z",
            x: 1,
            y: 2,
          },
        ],
      }).success
    ).toBe(false);
  });
});
