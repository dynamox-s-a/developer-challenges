import type {
  Machine,
  MonitoringPoint,
  TimeSeriesDetail,
  TimeSeriesMetrics,
  TimeSeriesSummary,
} from "@dyn/contracts";
import { ThemeProvider } from "@mui/material";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";
import type { ApiClient } from "../../api/client";
import { createAppStore } from "../../app/store";
import { theme } from "../../app/theme";
import { createFakeApi } from "../../test/fakeApi";
import { TimeSeriesPage } from "./TimeSeriesPage";

const MACHINE_ID = "00000000-0000-4000-8000-000000000001";
const POINT_ID = "00000000-0000-4000-8000-000000000020";
const OTHER_POINT_ID = "00000000-0000-4000-8000-000000000021";

const machine: Machine = {
  id: MACHINE_ID,
  name: "Primary pump",
  type: "Pump",
  createdAt: "2026-08-24T12:00:00.000Z",
  updatedAt: "2026-08-24T12:00:00.000Z",
};

const point: MonitoringPoint = {
  id: POINT_ID,
  machineId: MACHINE_ID,
  name: "Drive-end bearing",
  sensor: {
    id: "sensor-1",
    monitoringPointId: POINT_ID,
    model: "HF+",
    createdAt: "2026-08-24T12:00:00.000Z",
  },
  createdAt: "2026-08-24T12:00:00.000Z",
  updatedAt: "2026-08-24T12:00:00.000Z",
};

const otherPoint: MonitoringPoint = {
  ...point,
  id: OTHER_POINT_ID,
  name: "Non-drive-end bearing",
  sensor: null,
};

const summary: TimeSeriesSummary = {
  id: "00000000-0000-4000-8000-000000000010",
  monitoringPointId: POINT_ID,
  sensorId: "sensor-1",
  label: "Baseline",
  sampleCount: 3,
  startedAt: "2026-08-24T12:00:00.000Z",
  endedAt: "2026-08-24T12:00:03.000Z",
  createdAt: "2026-08-24T12:00:04.000Z",
};

const detail: TimeSeriesDetail = {
  ...summary,
  samples: [
    { timestamp: "2026-08-24T12:00:00.000Z", x: 1, y: 2, z: 3 },
    { timestamp: "2026-08-24T12:00:01.000Z", x: 2, y: 3, z: 4 },
    { timestamp: "2026-08-24T12:00:03.000Z", x: 3, y: 4, z: 5 },
  ],
};

const metrics: TimeSeriesMetrics = {
  seriesId: summary.id,
  sampleCount: summary.sampleCount,
  startedAt: summary.startedAt,
  endedAt: summary.endedAt,
  axes: {
    x: { min: 1, max: 3, mean: 2, rms: 2.16 },
    y: { min: 2, max: 4, mean: 3, rms: 3.11 },
    z: { min: 3, max: 5, mean: 4, rms: 4.08 },
  },
  vectorMagnitudeRms: 5.5,
};

function renderPage(overrides: Partial<ApiClient> = {}) {
  const store = createAppStore(createFakeApi(overrides));
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <TimeSeriesPage />
      </ThemeProvider>
    </Provider>
  );
  return store;
}

function listResponse(items: TimeSeriesSummary[]) {
  return { items, page: 1, pageSize: 20, total: items.length, totalPages: 1 };
}

describe("TimeSeriesPage", () => {
  it("labels each series with its machine and monitoring point instead of raw ids", async () => {
    renderPage({
      listMachines: async () => [machine],
      listMachineMonitoringPoints: async () => [point],
      listTimeSeries: async () => listResponse([summary]),
    });

    expect(await screen.findByText("Drive-end bearing")).toBeInTheDocument();
    expect(screen.getByText("Primary pump")).toBeInTheDocument();
    expect(screen.getByText("HF+")).toBeInTheDocument();
    expect(screen.queryByText(POINT_ID)).not.toBeInTheDocument();
  });

  it("filters through machine and monitoring point selects rather than pasted ids", async () => {
    const user = userEvent.setup();
    const listTimeSeries = vi.fn(async () => listResponse([summary]));
    renderPage({
      listMachines: async () => [machine],
      listMachineMonitoringPoints: async () => [point, otherPoint],
      listTimeSeries,
    });

    await user.click(await screen.findByLabelText("Machine"));
    await user.click(screen.getByRole("option", { name: "Primary pump (Pump)" }));
    await user.click(screen.getByLabelText("Monitoring point"));
    await user.click(screen.getByRole("option", { name: /Drive-end bearing/ }));

    await waitFor(() =>
      expect(listTimeSeries).toHaveBeenLastCalledWith({
        page: 1,
        pageSize: 20,
        monitoringPointId: POINT_ID,
      })
    );
    expect(screen.queryByLabelText(/Monitoring point ID/i)).not.toBeInTheDocument();
  });

  it("scopes the monitoring point options to the selected machine", async () => {
    const user = userEvent.setup();
    renderPage({
      listMachines: async () => [machine, { ...machine, id: OTHER_POINT_ID, name: "Cooling fan" }],
      listMachineMonitoringPoints: async (machineId) => (machineId === MACHINE_ID ? [point] : []),
      listTimeSeries: async () => listResponse([]),
    });

    await user.click(await screen.findByLabelText("Machine"));
    await user.click(screen.getByRole("option", { name: "Cooling fan (Pump)" }));

    expect(screen.getByText("This machine has no monitoring point yet.")).toBeInTheDocument();
  });

  it("surfaces a machine loading failure with a retry instead of a disabled upload button", async () => {
    const user = userEvent.setup();
    const listMachines = vi
      .fn<ApiClient["listMachines"]>()
      .mockRejectedValueOnce(new Error("Machines are unavailable."))
      .mockResolvedValue([machine]);
    renderPage({
      listMachines,
      listMachineMonitoringPoints: async () => [point],
      listTimeSeries: async () => listResponse([summary]),
    });

    expect(await screen.findByText("Machines are unavailable.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(await screen.findByLabelText("Machine")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Upload CSV/ })).toBeEnabled();
  });

  it("opens the detail dialog with the metrics and chart of the chosen series", async () => {
    const user = userEvent.setup();
    renderPage({
      listMachines: async () => [machine],
      listMachineMonitoringPoints: async () => [point],
      listTimeSeries: async () => listResponse([summary]),
      getTimeSeriesMetrics: async () => metrics,
      getFullTimeSeries: async () => detail,
    });

    await user.click(await screen.findByLabelText("View Baseline"));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Vector magnitude RMS")).toBeInTheDocument();
    expect(within(dialog).getByText("5.5000")).toBeInTheDocument();
    // Recharts does not lay out in jsdom, so the chart is asserted through its accessible region.
    expect(
      within(dialog).getByRole("img", { name: "Time-series X, Y, and Z axis chart" })
    ).toBeInTheDocument();
  });

  it("clears a detail failure before an unrelated operation dialog opens", async () => {
    const user = userEvent.setup();
    const message = "The time-series detail is unavailable.";
    renderPage({
      listMachines: async () => [machine],
      listMachineMonitoringPoints: async () => [point],
      listTimeSeries: async () => listResponse([summary]),
      getTimeSeriesMetrics: vi.fn().mockRejectedValue(new Error(message)),
      getFullTimeSeries: async () => detail,
    });

    await user.click(await screen.findByLabelText("View Baseline"));
    const detailDialog = await screen.findByRole("dialog");
    expect(await within(detailDialog).findByText(message)).toBeInTheDocument();

    await user.click(within(detailDialog).getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.queryByText(message)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Upload CSV/ }));
    expect(within(await screen.findByRole("dialog")).queryByText(message)).not.toBeInTheDocument();
  });

  it("keeps the series when the delete confirmation is cancelled", async () => {
    const user = userEvent.setup();
    const deleteTimeSeries = vi.fn(async () => undefined);
    renderPage({
      listMachines: async () => [machine],
      listMachineMonitoringPoints: async () => [point],
      listTimeSeries: async () => listResponse([summary]),
      deleteTimeSeries,
    });

    await user.click(await screen.findByLabelText("Delete Baseline"));
    expect(await screen.findByText("Delete time series?")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(deleteTimeSeries).not.toHaveBeenCalled();
    expect(screen.getByText("Baseline")).toBeInTheDocument();
  });

  it("removes the series once the delete is confirmed", async () => {
    const user = userEvent.setup();
    let stored = [summary];
    const deleteTimeSeries = vi.fn(async (id: string) => {
      stored = stored.filter((series) => series.id !== id);
    });
    renderPage({
      listMachines: async () => [machine],
      listMachineMonitoringPoints: async () => [point],
      listTimeSeries: async () => listResponse(stored),
      deleteTimeSeries,
    });

    await user.click(await screen.findByLabelText("Delete Baseline"));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(deleteTimeSeries).toHaveBeenCalledWith(summary.id);
    await waitFor(() => expect(screen.queryByText("Baseline")).not.toBeInTheDocument());
    expect(await screen.findByText("No time series found")).toBeInTheDocument();
  });
});
