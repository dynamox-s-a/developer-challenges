import type { TimeSeriesDetail, TimeSeriesMetrics, TimeSeriesSample } from "@dyn/contracts";
import { ThemeProvider } from "@mui/material";
import { render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";
import type { ApiClient } from "../../api/client";
import { createAppStore } from "../../app/store";
import { theme } from "../../app/theme";
import { createFakeApi } from "../../test/fakeApi";
import { TimeSeriesDetailDialog } from "./TimeSeriesDetailDialog";
import { fetchTimeSeriesDetail } from "./timeSeriesSlice";

const SERIES_ID = "00000000-0000-4000-8000-000000000010";
const POINT_ID = "00000000-0000-4000-8000-000000000020";
const CHART_LABEL = "Time-series X, Y, and Z axis chart";

function deferred<T>() {
  let resolve: (value: T) => void = () => {
    throw new Error("Deferred promise was not initialized.");
  };
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

const FIRST_SAMPLE_AT = Date.parse("2026-08-24T12:00:00.000Z");

function timestampAt(index: number): string {
  return new Date(FIRST_SAMPLE_AT + index * 1_000).toISOString();
}

function samples(count: number): TimeSeriesSample[] {
  return Array.from({ length: count }, (_, index) => ({
    timestamp: timestampAt(index),
    x: index,
    y: index + 1,
    z: index + 2,
  }));
}

function detailOf(sampleCount: number): TimeSeriesDetail {
  return {
    id: SERIES_ID,
    monitoringPointId: POINT_ID,
    sensorId: "sensor-1",
    label: "Baseline",
    sampleCount,
    startedAt: timestampAt(0),
    endedAt: timestampAt(sampleCount - 1),
    createdAt: "2026-08-24T12:00:10.000Z",
    samples: samples(sampleCount),
  };
}

function metricsOf(sampleCount: number): TimeSeriesMetrics {
  return {
    seriesId: SERIES_ID,
    sampleCount,
    startedAt: timestampAt(0),
    endedAt: timestampAt(sampleCount - 1),
    axes: {
      x: { min: -1.5, max: 2.25, mean: 0.5, rms: 1.25 },
      y: { min: -2, max: 4, mean: 1, rms: 2 },
      z: { min: -0.125, max: 0.5, mean: 0.25, rms: 0.375 },
    },
    vectorMagnitudeRms: 2.5,
  };
}

function renderDialog(overrides: Partial<ApiClient> = {}) {
  const store = createAppStore(createFakeApi(overrides));
  const view = () =>
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <TimeSeriesDetailDialog onClose={() => undefined} open />
        </ThemeProvider>
      </Provider>
    );
  return { store, view };
}

describe("TimeSeriesDetailDialog", () => {
  it("renders the metrics, the per-axis table, and the chart of a loaded series", async () => {
    const { store, view } = renderDialog({
      getTimeSeriesMetrics: async () => metricsOf(3),
      getFullTimeSeries: async () => detailOf(3),
    });
    await store.dispatch(fetchTimeSeriesDetail(SERIES_ID));
    view();

    expect(screen.getByText("Baseline")).toBeInTheDocument();
    expect(screen.getByText("Samples")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Vector magnitude RMS")).toBeInTheDocument();
    expect(screen.getByText("2.5000")).toBeInTheDocument();

    const xAxisRow = screen.getByRole("row", { name: /^X / });
    expect(within(xAxisRow).getByText("-1.5000")).toBeInTheDocument();
    expect(within(xAxisRow).getByText("2.2500")).toBeInTheDocument();
    expect(within(xAxisRow).getByText("1.2500")).toBeInTheDocument();
    // Integers stay unpadded, so the Y row proves the formatting branch.
    expect(within(screen.getByRole("row", { name: /^Y / })).getByText("-2")).toBeInTheDocument();

    // Recharts does not lay out in jsdom, so the chart is asserted through its accessible region.
    expect(screen.getByRole("img", { name: CHART_LABEL })).toBeInTheDocument();
    expect(screen.queryByText(/evenly sampled preview/)).not.toBeInTheDocument();
  });

  it("warns that the chart is downsampled for a series above a thousand samples", async () => {
    const { store, view } = renderDialog({
      getTimeSeriesMetrics: async () => metricsOf(1_200),
      getFullTimeSeries: async () => detailOf(1_200),
    });
    await store.dispatch(fetchTimeSeriesDetail(SERIES_ID));
    view();

    expect(screen.getByText("1,200")).toBeInTheDocument();
    expect(
      screen.getByText(/evenly sampled preview of the full 1,200-sample series/)
    ).toBeInTheDocument();
  });

  it("shows a spinner instead of the chart while the detail is loading", async () => {
    const pendingMetrics = deferred<TimeSeriesMetrics>();
    const { store, view } = renderDialog({
      getTimeSeriesMetrics: () => pendingMetrics.promise,
      getFullTimeSeries: async () => detailOf(3),
    });
    const request = store.dispatch(fetchTimeSeriesDetail(SERIES_ID));
    view();

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: CHART_LABEL })).not.toBeInTheDocument();

    pendingMetrics.resolve(metricsOf(3));
    await request;

    expect(await screen.findByRole("img", { name: CHART_LABEL })).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("shows the failure instead of an empty chart when the detail cannot be loaded", async () => {
    const { store, view } = renderDialog({
      getTimeSeriesMetrics: async () => {
        throw new Error("The time series is unavailable.");
      },
      getFullTimeSeries: async () => detailOf(3),
    });
    await store.dispatch(fetchTimeSeriesDetail(SERIES_ID));
    view();

    expect(screen.getByRole("alert")).toHaveTextContent("The time series is unavailable.");
    expect(screen.queryByRole("img", { name: CHART_LABEL })).not.toBeInTheDocument();
    expect(screen.getByText("Time-series detail")).toBeInTheDocument();
  });
});
