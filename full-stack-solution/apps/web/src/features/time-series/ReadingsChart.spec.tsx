import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@web/test/test-utils";
import { makeReadings } from "@web/test/fixtures";
import { ReadingsChart, formatReadingValue } from "./ReadingsChart";

describe("ReadingsChart", () => {
  it("labels the Y axis with the quantity and its unit", () => {
    renderWithProviders(
      <ReadingsChart readings={makeReadings(5)} metric="temperature" />,
    );

    expect(screen.getByText("Temperature (°C)")).toBeInTheDocument();
  });

  it("labels each quantity with its own unit", () => {
    renderWithProviders(
      <ReadingsChart
        readings={makeReadings(5, "vibrationVelocityRms")}
        metric="vibrationVelocityRms"
      />,
    );

    // Never a unit inferred from the sensor name or reused from another
    // quantity: mm/s belongs to velocity, not to temperature.
    expect(
      screen.getByText("Vibration velocity RMS (mm/s)"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/°C/)).not.toBeInTheDocument();
  });

  it("states the unit exactly once in the whole chart", () => {
    const { container } = renderWithProviders(
      <ReadingsChart readings={makeReadings(5)} metric="temperature" />,
    );

    // The axis label carries it. The legend names the series, and the card
    // around the chart titles the quantity — neither repeats the unit.
    const mentions = [...container.querySelectorAll("text")]
      .map((node) => node.textContent ?? "")
      .filter((text) => text.includes("°C"));

    expect(mentions).toEqual(["Temperature (°C)"]);
  });

  it("states the unit exactly once in a tooltip value", () => {
    // Recharts appends the series' own `unit` prop after whatever the
    // formatter returns, so owning the whole string here is what keeps the
    // unit from being rendered twice.
    const label = formatReadingValue(45.2, "temperature");

    // Compared against `toLocaleString` so the decimal separator of the
    // machine running the test does not matter.
    expect(label).toBe(`${(45.2).toLocaleString()} °C`);
    expect(label.match(/°C/g)).toHaveLength(1);
  });

  it("uses each quantity's own unit in the tooltip value", () => {
    expect(formatReadingValue(2.5, "vibrationVelocityRms")).toBe(
      `${(2.5).toLocaleString()} mm/s`,
    );
    expect(formatReadingValue(1.25, "vibrationAccelerationRms")).toBe(
      `${(1.25).toLocaleString()} m/s²`,
    );
  });

  it("names the series in the legend, without repeating the unit there", () => {
    const { container } = renderWithProviders(
      <ReadingsChart
        readings={makeReadings(5, "vibrationAccelerationRms")}
        metric="vibrationAccelerationRms"
      />,
    );

    const legend = container.querySelector(".recharts-legend-wrapper");

    // The axis label carries the unit; repeating it in the legend would be
    // the same information twice.
    expect(legend?.textContent).toBe("Vibration acceleration RMS");
  });

  it("places samples on a time scale rather than evenly spaced slots", () => {
    // Two samples a minute apart, then a gap of an hour. On a category axis
    // all three would be equidistant, which misrepresents the series.
    const readings = [
      { timestamp: "2026-01-01T00:00:00.000Z", value: 1, metric: "temperature" as const },
      { timestamp: "2026-01-01T00:01:00.000Z", value: 2, metric: "temperature" as const },
      { timestamp: "2026-01-01T01:01:00.000Z", value: 3, metric: "temperature" as const },
    ];

    const { container } = renderWithProviders(
      <ReadingsChart readings={readings} metric="temperature" />,
    );

    const xs = [...container.querySelectorAll("circle.recharts-dot")].map(
      (dot) => Number(dot.getAttribute("cx")),
    );

    expect(xs).toHaveLength(3);

    // The first gap is 1/61 of the span, so its horizontal step has to be a
    // fraction of the second one. On a category axis both would be equal.
    const firstStep = xs[1] - xs[0];
    const secondStep = xs[2] - xs[1];
    expect(firstStep).toBeGreaterThan(0);
    expect(firstStep).toBeLessThan(secondStep / 10);
  });
});
