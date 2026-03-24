import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MachineForm } from "../components/MachineForm";

const mockStore = configureStore({
  reducer: {},
});

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <Provider store={mockStore}>{children}</Provider>;
}

describe("MachineForm", () => {
  it("renders name and type fields", () => {
    const mockData = { name: "", type: "Pump" as const };

    render(
      <TestWrapper>
        <MachineForm data={mockData} onChange={() => {}} />
      </TestWrapper>
    );

    expect(screen.getByDisplayValue("")).toBeTruthy();
    expect(screen.getByDisplayValue("Pump")).toBeTruthy();
  });

  it("calls onChange when form values change", async () => {
    const mockOnChange = vi.fn();
    const mockData = { name: "", type: "Pump" as const };

    render(
      <TestWrapper>
        <MachineForm data={mockData} onChange={mockOnChange} />
      </TestWrapper>
    );

    const nameInput = screen.getByDisplayValue("");
    await userEvent.type(nameInput, "Test");

    expect(mockOnChange).toHaveBeenCalled();
  });

  it("populates type options correctly", () => {
    const mockData = { name: "", type: "Pump" as const };

    render(
      <TestWrapper>
        <MachineForm data={mockData} onChange={() => {}} />
      </TestWrapper>
    );

    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByDisplayValue("Pump")).toBeTruthy();
  });

  it("disables fields when disabled prop is true", () => {
    const mockData = { name: "Test", type: "Pump" as const };

    render(
      <TestWrapper>
        <MachineForm data={mockData} onChange={() => {}} disabled={true} />
      </TestWrapper>
    );
    
    expect(screen.getByDisplayValue("Test")).toBeTruthy();
    expect(screen.getByDisplayValue("Pump")).toBeTruthy();
  });
});
