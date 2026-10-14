import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@web/test/test-utils";
import { makeMonitoringPoint } from "@web/test/fixtures";
import { MonitoringPointsTable } from "./MonitoringPointsTable";

const points = [
  makeMonitoringPoint({
    id: "p1",
    name: "Bearing",
    machineName: "Pump A",
    machineType: "Pump",
    sensorId: "S-1",
    sensorModel: "HF+",
  }),
  makeMonitoringPoint({
    id: "p2",
    name: "Motor",
    machineName: "Fan B",
    machineType: "Fan",
  }),
];

function renderTable(overrides: Partial<Parameters<typeof MonitoringPointsTable>[0]> = {}) {
  const props = {
    monitoringPoints: points,
    sortBy: "machineName" as const,
    order: "asc" as const,
    onSort: vi.fn(),
    onRename: vi.fn(),
    onAssignSensor: vi.fn(),
    onRemoveSensor: vi.fn(),
    onDelete: vi.fn(),
    ...overrides,
  };

  return { props, ...renderWithProviders(<MonitoringPointsTable {...props} />) };
}

describe("MonitoringPointsTable", () => {
  it("shows the four required columns", () => {
    renderTable();

    for (const header of [
      "Machine name",
      "Machine type",
      "Monitoring point name",
      "Sensor model",
    ]) {
      expect(screen.getByRole("columnheader", { name: header })).toBeInTheDocument();
    }
  });

  it("shows the sensor model and id, or a placeholder when there is none", () => {
    renderTable();

    expect(screen.getByText("HF+")).toBeInTheDocument();
    expect(screen.getByText("S-1")).toBeInTheDocument();
    expect(screen.getByText("No sensor")).toBeInTheDocument();
  });

  it("marks the active column with its sort direction", () => {
    renderTable({ sortBy: "sensorModel", order: "desc" });

    expect(
      screen.getByRole("columnheader", { name: "Sensor model" }),
    ).toHaveAttribute("aria-sort", "descending");
    expect(
      screen.getByRole("columnheader", { name: "Machine name" }),
    ).not.toHaveAttribute("aria-sort");
  });

  it("reports the clicked column to the caller", async () => {
    const user = userEvent.setup();
    const { props } = renderTable();

    await user.click(screen.getByRole("button", { name: "Monitoring point name" }));

    expect(props.onSort).toHaveBeenCalledWith("name");
  });

  it("only offers to remove a sensor when one is attached", async () => {
    const user = userEvent.setup();
    const { props } = renderTable();

    expect(
      screen.queryByRole("button", { name: "Remove sensor from Motor" }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Remove sensor from Bearing" }),
    );

    expect(props.onRemoveSensor).toHaveBeenCalledWith(points[0]);
  });
});
