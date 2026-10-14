import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@web/test/test-utils";
import { makeMachine } from "@web/test/fixtures";
import { MachinesTable } from "./MachinesTable";

const machines = [
  makeMachine({ id: "a", name: "Pump A", type: "Pump", monitoringPointsCount: 2 }),
  makeMachine({ id: "b", name: "Fan B", type: "Fan", monitoringPointsCount: 1 }),
];

describe("MachinesTable", () => {
  it("renders one row per machine with its type and point count", () => {
    renderWithProviders(
      <MachinesTable
        machines={machines}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onAddMonitoringPoint={vi.fn()}
      />,
    );

    expect(screen.getByText("Pump A")).toBeInTheDocument();
    expect(screen.getByText("Fan B")).toBeInTheDocument();
    // Header row + two data rows.
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("flags machines below the recommended number of monitoring points", () => {
    renderWithProviders(
      <MachinesTable
        machines={machines}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onAddMonitoringPoint={vi.fn()}
      />,
    );

    expect(screen.getAllByText("Needs 2")).toHaveLength(1);
  });

  it("reports the machine of the clicked action", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onAddMonitoringPoint = vi.fn();
    renderWithProviders(
      <MachinesTable
        machines={machines}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddMonitoringPoint={onAddMonitoringPoint}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Edit Fan B" }));
    await user.click(screen.getByRole("button", { name: "Delete Pump A" }));
    await user.click(
      screen.getByRole("button", { name: "Add monitoring point to Pump A" }),
    );

    expect(onEdit).toHaveBeenCalledWith(machines[1]);
    expect(onDelete).toHaveBeenCalledWith(machines[0]);
    expect(onAddMonitoringPoint).toHaveBeenCalledWith(machines[0]);
  });
});
