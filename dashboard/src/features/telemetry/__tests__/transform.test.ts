import { describe, expect, it } from "vitest";
import { buildDashboardCharts } from "../lib/transform";
import type { TelemetryResponse } from "../model/types";

const response: TelemetryResponse = [
  ...["x", "y", "z"].map((axis, index) => ({
    name: `accelerationRms/${axis}`,
    data: [{ datetime: "2023-01-01T00:00:00.000Z", max: index }],
  })),
  {
    name: "temperature",
    data: [{ datetime: "2023-01-01T00:00:00.000Z", max: 23 }],
  },
  ...["x", "y", "z"].map((axis, index) => ({
    name: `velocityRms/${axis}`,
    data: [{ datetime: "2023-01-01T00:00:00.000Z", max: index + 4 }],
  })),
];

describe("buildDashboardCharts", () => {
  it("agrupa as séries da API em gráficos esperados", () => {
    const charts = buildDashboardCharts(response);
    expect(charts.map((chart) => chart.title)).toEqual([
      "Aceleração RMS",
      "Temperatura",
      "Velocidade RMS",
    ]);
    expect(charts.map((chart) => chart.series)).toHaveLength(3);
    expect(charts[0].series.map((series) => series.name)).toEqual([
      "Axial",
      "Horizontal",
      "Radial",
    ]);
    expect(charts[1].series[0].name).toBe("Temperatura");
    expect(charts[2].unit).toBe("g");
    expect(charts[1].unit).toBe("°C");
    expect(charts[1].series[0].data[0]).toEqual([1672531200000, 23]);
  });
});
