import type { MonitoringPointListItem } from "@dyn/contracts";
import { ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { theme } from "../../app/theme";
import { SensorDialog } from "./SensorDialog";

const pumpPoint: MonitoringPointListItem = {
  id: "00000000-0000-4000-8000-000000000011",
  machineId: "00000000-0000-4000-8000-000000000001",
  machineName: "Primary pump",
  machineType: "Pump",
  monitoringPointName: "Drive-end bearing",
  sensorId: null,
  sensorModel: null,
  createdAt: "2026-08-24T12:00:00.000Z",
};

const fanPoint: MonitoringPointListItem = {
  ...pumpPoint,
  machineName: "Cooling fan",
  machineType: "Fan",
};

function renderDialog(props: {
  point: MonitoringPointListItem;
  onSubmit?: (input: unknown) => void;
  error?: string | null;
}) {
  render(
    <ThemeProvider theme={theme}>
      <SensorDialog
        error={props.error ?? null}
        onClose={() => undefined}
        onSubmit={props.onSubmit ?? (() => undefined)}
        pending={false}
        point={props.point}
      />
    </ThemeProvider>
  );
}

describe("SensorDialog", () => {
  it("offers only HF+ for a Pump and explains why", async () => {
    const user = userEvent.setup();
    renderDialog({ point: pumpPoint });

    expect(screen.getByText(/Pumps only support HF\+ sensors/)).toBeInTheDocument();
    expect(screen.getByLabelText("Sensor model")).toHaveTextContent("HF+");

    await user.click(screen.getByLabelText("Sensor model"));

    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual(["HF+"]);
  });

  it("offers every model for a Fan without the compatibility notice", async () => {
    const user = userEvent.setup();
    renderDialog({ point: fanPoint });

    expect(screen.queryByText(/Pumps only support HF\+ sensors/)).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Sensor model"));

    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual([
      "TcAg",
      "TcAs",
      "HF+",
    ]);
  });

  it("submits the trimmed sensor id with the selected model", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderDialog({ point: fanPoint, onSubmit });

    await user.type(screen.getByLabelText(/Sensor ID/i), "  sensor-7  ");
    await user.click(screen.getByLabelText("Sensor model"));
    await user.click(screen.getByRole("option", { name: "TcAs" }));
    await user.click(screen.getByRole("button", { name: "Associate" }));

    expect(onSubmit).toHaveBeenCalledWith({ sensorId: "sensor-7", model: "TcAs" });
  });

  it("shows a rejected association inside the dialog", () => {
    renderDialog({ point: pumpPoint, error: "Pump machines only support HF+ sensors" });

    // The rejection is shown above the standing compatibility notice, so both alerts are present.
    const [rejection, notice] = screen.getAllByRole("alert");
    expect(rejection).toHaveTextContent("Pump machines only support HF+ sensors");
    expect(notice).toHaveTextContent(/TcAg and TcAs are not compatible/);
  });
});
