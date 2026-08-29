import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import {
  machines,
  monitoringPoints,
  sensors,
  timeSeries,
  timeSeriesSamples,
} from "../src/index.js";

describe("database schema", () => {
  it("uses stable table names for committed migrations", () => {
    expect([
      getTableName(machines),
      getTableName(monitoringPoints),
      getTableName(sensors),
      getTableName(timeSeries),
      getTableName(timeSeriesSamples),
    ]).toEqual(["machines", "monitoring_points", "sensors", "time_series", "time_series_samples"]);
  });
});
