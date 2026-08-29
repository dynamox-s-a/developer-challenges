import type { Machine, MonitoringPoint } from "@dyn/contracts";
import { ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";
import type { ApiClient } from "../../api/client";
import { createAppStore } from "../../app/store";
import { theme } from "../../app/theme";
import { createFakeApi } from "../../test/fakeApi";
import { UploadTimeSeriesDialog } from "./UploadTimeSeriesDialog";

const MACHINE_ID = "00000000-0000-4000-8000-000000000001";
const POINT_ID = "00000000-0000-4000-8000-000000000020";

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

function renderDialog(machines: Machine[], overrides: Partial<ApiClient> = {}) {
  const store = createAppStore(createFakeApi(overrides));
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <UploadTimeSeriesDialog
          machines={machines}
          onClose={vi.fn()}
          onSubmit={vi.fn()}
          open
          pending={false}
          submitError={null}
        />
      </ThemeProvider>
    </Provider>
  );
  return store;
}

describe("UploadTimeSeriesDialog", () => {
  it("offers a safe, static CSV template download", () => {
    renderDialog([]);

    const link = screen.getByRole("link", { name: /download csv template/i });
    expect(link).toHaveAttribute("download", "time-series-template.csv");
    expect(decodeURIComponent(link.getAttribute("href") ?? "")).toContain(
      "timestamp,x,y,z\n2026-01-01T00:00:00.000Z,0,0,0"
    );
  });

  it("loads the monitoring points of the machine chosen by the operator", async () => {
    const user = userEvent.setup();
    const listMachineMonitoringPoints = vi.fn(async () => [point]);
    renderDialog([machine], { listMachineMonitoringPoints });

    await user.click(screen.getByLabelText("Machine"));
    await user.click(screen.getByRole("option", { name: "Primary pump (Pump)" }));
    await user.click(await screen.findByLabelText("Monitoring point"));

    expect(listMachineMonitoringPoints).toHaveBeenCalledWith(MACHINE_ID);
    expect(screen.getByRole("option", { name: /Drive-end bearing/ })).toBeInTheDocument();
  });
});
