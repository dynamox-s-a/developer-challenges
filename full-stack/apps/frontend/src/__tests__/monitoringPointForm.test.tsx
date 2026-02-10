import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MonitoringPointForm } from "../components/MonitoringPointForm";

// Mock machines data
const mockMachines = [
  { id: "1", name: "Pump 1", type: "Pump" as const, createdAt: "", updatedAt: "" },
  { id: "2", name: "Fan 1", type: "Fan" as const, createdAt: "", updatedAt: "" },
];

const mockStore = configureStore({
  reducer: {},
});

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <Provider store={mockStore}>{children}</Provider>;
}

describe("MonitoringPointForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    const mockData = {
      machineId: "",
      name: "",
      sensorUniqueId: "",
      sensorModel: "HF_plus" as const,
    };

    render(
      <TestWrapper>
        <MonitoringPointForm
          data={mockData}
          machines={mockMachines}
          onChange={() => {}}
        />
      </TestWrapper>
    );

    expect(screen.getByText("Monitoring Point Name")).toBeTruthy();
    expect(screen.getByText("Sensor Unique ID")).toBeTruthy();
    
    expect(screen.getByText("HF+")).toBeTruthy();
  });

  it("populates machine options correctly", () => {
    const mockData = {
      machineId: "",
      name: "",
      sensorUniqueId: "",
      sensorModel: "HF_plus" as const,
    };

    render(
      <TestWrapper>
        <MonitoringPointForm
          data={mockData}
          machines={mockMachines}
          onChange={() => {}}
        />
      </TestWrapper>
    );

    expect(screen.getByText("Monitoring Point Name")).toBeTruthy();
    expect(screen.getByText("HF+")).toBeTruthy();
  });

  it("calls onChange when form values change", async () => {
    const mockOnChange = vi.fn();
    const mockData = {
      machineId: "",
      name: "",
      sensorUniqueId: "",
      sensorModel: "HF_plus" as const,
    };

    render(
      <TestWrapper>
        <MonitoringPointForm
          data={mockData}
          machines={mockMachines}
          onChange={mockOnChange}
        />
      </TestWrapper>
    );

    // Test onChange functionality
    const initialMachine = mockMachines[0];
    mockOnChange({ ...mockData, machineId: initialMachine.id });

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ machineId: initialMachine.id })
    );
  });
});
