import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import ChartCard from "../app/components/ChartCard";
import { renderWithProviders } from "./utils";

describe("ChartCard", () => {
  it("renders the title as a level 2 heading", () => {
    renderWithProviders(<ChartCard title="Temperatura">content</ChartCard>);
    expect(
      screen.getByRole("heading", { level: 2, name: "Temperatura" }),
    ).toBeInTheDocument();
  });

  it("renders children", () => {
    renderWithProviders(
      <ChartCard title="Temperatura">
        <p>chart goes here</p>
      </ChartCard>,
    );
    expect(screen.getByText("chart goes here")).toBeInTheDocument();
  });

  it("exposes a region named by the title", () => {
    renderWithProviders(<ChartCard title="Velocidade RMS">x</ChartCard>);
    expect(
      screen.getByRole("region", { name: "Velocidade RMS" }),
    ).toBeInTheDocument();
  });

  it("gives two cards distinct regions", () => {
    renderWithProviders(
      <>
        <ChartCard title="A">x</ChartCard>
        <ChartCard title="B">y</ChartCard>
      </>,
    );
    expect(screen.getAllByRole("region")).toHaveLength(2);
    expect(screen.getByRole("region", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "B" })).toBeInTheDocument();
  });
});
