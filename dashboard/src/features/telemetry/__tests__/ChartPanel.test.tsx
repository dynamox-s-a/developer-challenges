import { describe, expect, it } from "vitest";
import { makeChartOptions } from "../lib/chartOptions";
import type { DashboardChart } from "../model/types";

const chart: DashboardChart = {
  id: "acceleration",
  title: "Aceleração RMS",
  unit: "g",
  series: [
    { id: "x", name: "X", data: [[1, 2]] },
    { id: "y", name: "Y", data: [[1, 3]] },
    { id: "z", name: "Z", data: [[1, 4]] },
  ],
};

describe("makeChartOptions", () => {
  it("configura um gráfico com datetime e séries", () => {
    const options = makeChartOptions(chart);
    expect(options.xAxis).toMatchObject({ type: "datetime" });
    expect(options.chart).toMatchObject({
      backgroundColor: "#ffffff",
      plotBackgroundColor: "#ffffff",
    });
    expect(options.yAxis).toMatchObject({
      title: { text: "Aceleração RMS (g)" },
    });
    expect(options.series).toHaveLength(3);
    expect(options.legend).toMatchObject({ enabled: true });
    expect(options.tooltip).toMatchObject({ shared: true, valueSuffix: " g" });
  });
});
