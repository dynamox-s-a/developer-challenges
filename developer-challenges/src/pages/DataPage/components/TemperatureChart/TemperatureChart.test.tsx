import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { TemperatureChart } from "./TemperatureChart";
import type { RawSeries } from "../../../../features/machineData/types";

const readings: RawSeries[] = [
	{ name: "accelerationRms/x", data: [{ datetime: "2023-11-07T11:00:00.000Z", max: 1 }] },
	{
		name: "temperature",
		data: [
			{ datetime: "2023-11-07T15:00:00.000Z", max: 40 },
			{ datetime: "2023-11-07T11:00:00.000Z", max: 45 },
		],
	},
];

describe("TemperatureChart", () => {
	it("renders a single Temperatura series", () => {
		const { container } = render(<TemperatureChart readings={readings} />);
		const legendLabels = Array.from(container.querySelectorAll(".highcharts-legend-item")).map(
			(node) => node.textContent,
		);
		expect(legendLabels).toEqual(["Temperatura"]);
	});

	it("renders no series when there is no temperature data", () => {
		const { container } = render(<TemperatureChart readings={[]} />);
		expect(container.querySelectorAll(".highcharts-legend-item")).toHaveLength(0);
	});
});
