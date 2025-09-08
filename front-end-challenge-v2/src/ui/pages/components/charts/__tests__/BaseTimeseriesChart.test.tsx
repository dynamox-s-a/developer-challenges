import BaseTimeseriesChart from "@/ui/pages/components/charts/BaseTimeseriesChart";
import { render, screen } from "@testing-library/react";

describe("BaseTimeseriesChart", () => {
  it("renderiza título", () => {
    render(
      <BaseTimeseriesChart
        title="Aceleração (RMS)"
        yTitle="g (aprox)"
        series={[]}
      />
    );
    expect(screen.getByText("Aceleração (RMS)")).toBeInTheDocument();
  });
});
