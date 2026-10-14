import { describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@web/test/test-utils";
import { makeMonitoringPoint } from "@web/test/fixtures";
import { SensorFormDialog } from "./SensorFormDialog";

describe("SensorFormDialog", () => {
  it("offers every sensor model for a Fan machine", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SensorFormDialog
        open
        monitoringPoint={makeMonitoringPoint({
          machineType: "Fan",
          machineName: "Fan B",
        })}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByLabelText("Sensor model"));
    const options = within(screen.getByRole("listbox")).getAllByRole("option");

    expect(options.map((option) => option.getAttribute("aria-disabled"))).toEqual([
      null,
      null,
      null,
    ]);
  });

  it("disables TcAg and TcAs on a Pump machine and says why", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SensorFormDialog
        open
        monitoringPoint={makeMonitoringPoint({ machineType: "Pump" })}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByLabelText("Sensor model"));
    const listbox = screen.getByRole("listbox");

    expect(
      within(listbox).getByRole("option", { name: /TcAg/ }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(
      within(listbox).getByRole("option", { name: /TcAs/ }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(within(listbox).getByRole("option", { name: /HF\+/ })).not.toHaveAttribute(
      "aria-disabled",
    );
    // Both blocked models explain the restriction inline.
    expect(within(listbox).getAllByText(/not allowed on Pump/)).toHaveLength(2);
  });

  it("preselects the only model a Pump accepts", () => {
    renderWithProviders(
      <SensorFormDialog
        open
        monitoringPoint={makeMonitoringPoint({ machineType: "Pump" })}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Sensor model")).toHaveTextContent("HF+");
  });

  it("submits the sensor id and model", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(
      <SensorFormDialog
        open
        monitoringPoint={makeMonitoringPoint({ machineType: "Pump" })}
        onSubmit={onSubmit}
        onClose={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText("Sensor ID"), "SENSOR-001");
    await user.click(screen.getByRole("button", { name: "Assign sensor" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ id: "SENSOR-001", model: "HF+" }),
        expect.anything(),
      );
    });
  });

  it("rejects a blocked model instead of calling the API", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(
      <SensorFormDialog
        open
        // A point that already carries TcAg on a machine later switched to Pump.
        monitoringPoint={makeMonitoringPoint({
          machineType: "Pump",
          sensorId: "SENSOR-OLD",
          sensorModel: "TcAg",
        })}
        onSubmit={onSubmit}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Replace sensor" }));

    expect(
      await screen.findByText(
        "Sensor model TcAg cannot be used on Pump machines",
      ),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("requires a sensor id", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(
      <SensorFormDialog
        open
        monitoringPoint={makeMonitoringPoint({ machineType: "Fan" })}
        onSubmit={onSubmit}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Assign sensor" }));

    expect(await screen.findByText("Sensor ID is required")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
