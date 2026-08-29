import type { MonitoringPointListItem, MonitoringPointListResponse, Sensor } from "@dyn/contracts";
import { MONITORING_POINT_PAGE_SIZE } from "@dyn/contracts";
import { ThemeProvider } from "@mui/material";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { ApiClient, MonitoringPointQuery } from "../../api/client";
import { createAppStore } from "../../app/store";
import { theme } from "../../app/theme";
import { AppShell } from "../../layout/AppShell";
import { createFakeApi } from "../../test/fakeApi";
import { MonitoringPointsPage } from "./MonitoringPointsPage";

const MACHINE_ID = "00000000-0000-4000-8000-000000000001";
const FREE_POINT_ID = "00000000-0000-4000-8000-000000000010";

// Twelve rows across three pages of five: enough to prove the page size and the page requests.
const points: MonitoringPointListItem[] = Array.from({ length: 12 }, (_, index) => ({
  id: `00000000-0000-4000-8000-0000000000${String(index + 10)}`,
  machineId: MACHINE_ID,
  machineName: "Primary pump",
  machineType: "Pump",
  monitoringPointName: `Point ${index + 1}`,
  // Only the first point is free in the default fixture.
  sensorId: index === 0 ? null : `sensor-${index}`,
  sensorModel: index === 0 ? null : "HF+",
  createdAt: "2026-08-24T12:00:00.000Z",
}));

const attachedSensor: Sensor = {
  id: "sensor-99",
  monitoringPointId: FREE_POINT_ID,
  model: "HF+",
  createdAt: "2026-08-24T12:00:00.000Z",
};

async function pageOf(query: MonitoringPointQuery): Promise<MonitoringPointListResponse> {
  const start = (query.page - 1) * MONITORING_POINT_PAGE_SIZE;
  return {
    items: points.slice(start, start + MONITORING_POINT_PAGE_SIZE),
    page: query.page,
    pageSize: MONITORING_POINT_PAGE_SIZE,
    total: points.length,
    totalPages: Math.ceil(points.length / MONITORING_POINT_PAGE_SIZE),
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  };
}

async function pageWithTwoFreePoints(
  query: MonitoringPointQuery
): Promise<MonitoringPointListResponse> {
  const response = await pageOf(query);
  return {
    ...response,
    items: response.items.slice(0, 2).map((point) => ({
      ...point,
      sensorId: null,
      sensorModel: null,
    })),
    total: 2,
    totalPages: 1,
  };
}

// Rendered inside the shell because the success snackbar lives there, not on the page.
function renderPage(overrides: Partial<ApiClient> = {}) {
  const store = createAppStore(createFakeApi({ listMonitoringPoints: pageOf, ...overrides }));
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MemoryRouter
          future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
          initialEntries={["/monitoring-points"]}
        >
          <Routes>
            <Route element={<AppShell />}>
              <Route element={<MonitoringPointsPage />} path="monitoring-points" />
            </Route>
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
  return store;
}

describe("MonitoringPointsPage", () => {
  it("loads the first page of five rows sorted by point name", async () => {
    const listMonitoringPoints = vi.fn(pageOf);
    renderPage({ listMonitoringPoints });

    expect(await screen.findByText("Point 1")).toBeInTheDocument();
    expect(listMonitoringPoints).toHaveBeenCalledWith({
      page: 1,
      sortBy: "monitoringPointName",
      sortOrder: "asc",
    });
    // One header row plus the five rows of the page.
    expect(screen.getAllByRole("row")).toHaveLength(MONITORING_POINT_PAGE_SIZE + 1);
    expect(screen.getByText("Point 5")).toBeInTheDocument();
    expect(screen.queryByText("Point 6")).not.toBeInTheDocument();
    expect(screen.getByText("1–5 of 12")).toBeInTheDocument();
    expect(screen.getByText("Monitoring point").closest("th")).toHaveAttribute(
      "aria-sort",
      "ascending"
    );
  });

  it("labels every sensor association action with its row context", async () => {
    renderPage({ listMonitoringPoints: pageWithTwoFreePoints });

    await screen.findByText("Point 1");
    expect(
      screen.getByRole("button", {
        name: "Associate sensor with Point 1 on Primary pump",
      })
    ).toBeEnabled();
    expect(
      screen.getByRole("button", {
        name: "Associate sensor with Point 2 on Primary pump",
      })
    ).toBeEnabled();
  });

  it("sorts ascending then descending on repeated clicks of the same column", async () => {
    const user = userEvent.setup();
    const listMonitoringPoints = vi.fn(pageOf);
    renderPage({ listMonitoringPoints });
    await screen.findByText("Point 1");

    await user.click(screen.getByRole("button", { name: /Machine name/ }));
    await waitFor(() =>
      expect(listMonitoringPoints).toHaveBeenLastCalledWith({
        page: 1,
        sortBy: "machineName",
        sortOrder: "asc",
      })
    );
    expect(screen.getByText("Machine name").closest("th")).toHaveAttribute(
      "aria-sort",
      "ascending"
    );

    await user.click(screen.getByRole("button", { name: /Machine name/ }));
    await waitFor(() =>
      expect(listMonitoringPoints).toHaveBeenLastCalledWith({
        page: 1,
        sortBy: "machineName",
        sortOrder: "desc",
      })
    );
    expect(screen.getByText("Machine name").closest("th")).toHaveAttribute(
      "aria-sort",
      "descending"
    );
  });

  it("requests the chosen page from the pagination controls", async () => {
    const user = userEvent.setup();
    const listMonitoringPoints = vi.fn(pageOf);
    renderPage({ listMonitoringPoints });
    await screen.findByText("Point 1");

    await user.click(screen.getByRole("button", { name: "Go to next page" }));

    await waitFor(() =>
      expect(listMonitoringPoints).toHaveBeenLastCalledWith({
        page: 2,
        sortBy: "monitoringPointName",
        sortOrder: "asc",
      })
    );
    expect(await screen.findByText("Point 6")).toBeInTheDocument();
    expect(screen.queryByText("Point 5")).not.toBeInTheDocument();
    expect(screen.getByText("6–10 of 12")).toBeInTheDocument();
  });

  it("returns to the first page when the sort changes on a later page", async () => {
    const user = userEvent.setup();
    const listMonitoringPoints = vi.fn(pageOf);
    renderPage({ listMonitoringPoints });
    await screen.findByText("Point 1");

    await user.click(screen.getByRole("button", { name: "Go to next page" }));
    await screen.findByText("Point 6");

    await user.click(screen.getByRole("button", { name: /Sensor model/ }));

    await waitFor(() =>
      expect(listMonitoringPoints).toHaveBeenLastCalledWith({
        page: 1,
        sortBy: "sensorModel",
        sortOrder: "asc",
      })
    );
    expect(await screen.findByText("1–5 of 12")).toBeInTheDocument();
  });

  it("associates a sensor and writes the model back into the row", async () => {
    const user = userEvent.setup();
    const attachSensor = vi.fn(async () => attachedSensor);
    renderPage({ attachSensor });
    await screen.findByText("Point 1");

    await user.click(
      screen.getByRole("button", {
        name: "Associate sensor with Point 1 on Primary pump",
      })
    );
    await user.type(screen.getByLabelText(/Sensor ID/i), "sensor-99");
    await user.click(screen.getByRole("button", { name: "Associate" }));

    expect(await screen.findByText("Sensor attached")).toBeInTheDocument();
    expect(attachSensor).toHaveBeenCalledWith(FREE_POINT_ID, {
      sensorId: "sensor-99",
      model: "HF+",
    });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByText("sensor-99")).toBeInTheDocument();
    expect(screen.queryByText("Not associated")).not.toBeInTheDocument();
  });

  it("clears a rejected association before another sensor dialog opens", async () => {
    const user = userEvent.setup();
    const message = "Sensor ID is already associated with another point";
    renderPage({
      attachSensor: vi.fn().mockRejectedValue(new Error(message)),
      listMonitoringPoints: pageWithTwoFreePoints,
    });
    await screen.findByText("Point 1");

    await user.click(
      screen.getByRole("button", {
        name: "Associate sensor with Point 1 on Primary pump",
      })
    );
    const firstDialog = await screen.findByRole("dialog");
    await user.type(within(firstDialog).getByLabelText(/Sensor ID/i), "duplicate-sensor");
    await user.click(within(firstDialog).getByRole("button", { name: "Associate" }));
    expect(await within(firstDialog).findByText(message)).toBeInTheDocument();

    await user.click(within(firstDialog).getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await user.click(
      screen.getByRole("button", {
        name: "Associate sensor with Point 2 on Primary pump",
      })
    );

    expect(within(await screen.findByRole("dialog")).queryByText(message)).not.toBeInTheDocument();
  });
});
