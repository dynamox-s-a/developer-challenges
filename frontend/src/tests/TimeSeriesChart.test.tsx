import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Options } from "highcharts";
import TimeSeriesChart from "../app/components/TimeSeriesChart";
import { chartsFixture } from "./features/data/fixtures";
import { buildChartOptions } from "../features/utils/chartOptions";

vi.mock("../features/utils/chartOptions", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../features/utils/chartOptions")>();
  return { ...actual, buildChartOptions: vi.fn(actual.buildChartOptions) };
});

vi.mock("highcharts-react-official", () => ({
  HighchartsReact: ({ options }: { options: Options }) => (
    <div data-testid="chart" data-series-count={options.series?.length} />
  ),
}));

describe("TimeSeriesChart", () => {
  beforeEach(() => {
    vi.mocked(buildChartOptions).mockClear();
  });

  it("passes one series per input to the chart", () => {
    render(
      <TimeSeriesChart
        series={chartsFixture.acceleration}
        yAxisTitle="Aceleração RMS (g)"
      />,
    );
    expect(screen.getByTestId("chart")).toHaveAttribute(
      "data-series-count",
      String(chartsFixture.acceleration.length),
    );
  });

  it("does not rebuild options when props keep the same references", () => {
    const series = chartsFixture.acceleration;
    const { rerender } = render(
      <TimeSeriesChart series={series} yAxisTitle="g" />,
    );
    rerender(<TimeSeriesChart series={series} yAxisTitle="g" />);
    expect(buildChartOptions).toHaveBeenCalledTimes(1);
  });

  it("rebuilds options when the series reference changes", () => {
    const { rerender } = render(
      <TimeSeriesChart series={chartsFixture.acceleration} yAxisTitle="g" />,
    );
    rerender(
      <TimeSeriesChart
        series={[...chartsFixture.acceleration]}
        yAxisTitle="g"
      />,
    );
    expect(buildChartOptions).toHaveBeenCalledTimes(2);
  });
});
