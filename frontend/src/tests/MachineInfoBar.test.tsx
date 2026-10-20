import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import MachineInfoBar from "../app/components/MachineInfoBar";
import { renderWithProviders } from "./utils";
import { machineFixture } from "./features/data/fixtures";

describe("MachineInfoBar", () => {
  it("shows all machine values", () => {
    renderWithProviders(<MachineInfoBar machine={machineFixture} />);
    expect(screen.getByText("Máquina 1023")).toBeInTheDocument();
    expect(screen.getByText("Ponto 20192")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("16g")).toBeInTheDocument();
    expect(screen.getByText("20 min")).toBeInTheDocument();
  });

  it("gives each icon an accessible name", () => {
    renderWithProviders(<MachineInfoBar machine={machineFixture} />);
    expect(
      screen.getByRole("img", { name: "Taxa de amostragem" }),
    ).toBeInTheDocument();
  });

  it("renders five list items", () => {
    renderWithProviders(<MachineInfoBar machine={machineFixture} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });
});
