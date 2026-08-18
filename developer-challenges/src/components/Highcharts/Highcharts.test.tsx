import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Highcharts } from "./Highcharts";

describe("Highcharts", () => {
	it("renders a chart container for the given series", () => {
		const { container } = render(
			<Highcharts
				yAxisTitle="Aceleração RMS (g)"
				description="Gráfico de teste"
				series={[{ name: "Axial", data: [[0, 1], [1, 2]] }]}
			/>,
		);
		expect(container.querySelector(".highcharts-container")).toBeInTheDocument();
	});

	it("renders one legend item per series", () => {
		const { container } = render(
			<Highcharts
				yAxisTitle="Aceleração RMS (g)"
				description="Gráfico de teste"
				series={[
					{ name: "Axial", data: [[0, 1]] },
					{ name: "Radial", data: [[0, 2]] },
				]}
			/>,
		);
		expect(container.querySelectorAll(".highcharts-legend-item")).toHaveLength(2);
	});
});
