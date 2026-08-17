import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { AccelerationChart } from "./AccelerationChart";
import type { RawSeries } from "../../../../features/machineData/types";

const readings: RawSeries[] = [
	{
		name: "accelerationRms/x",
		data: [
			{ datetime: "2023-11-07T15:00:00.000Z", max: 1 },
			{ datetime: "2023-11-07T11:00:00.000Z", max: 2 },
		],
	},
	{ name: "accelerationRms/y", data: [{ datetime: "2023-11-07T11:00:00.000Z", max: 3 }] },
	{ name: "accelerationRms/z", data: [{ datetime: "2023-11-07T11:00:00.000Z", max: 4 }] },
	{ name: "velocityRms/x", data: [{ datetime: "2023-11-07T11:00:00.000Z", max: 5 }] },
	{ name: "temperature", data: [{ datetime: "2023-11-07T11:00:00.000Z", max: 45 }] },
];

describe("AccelerationChart", () => {
	it("renders only the acceleration axes as Axial/Horizontal/Radial", () => {
		const { container } = render(<AccelerationChart readings={readings} />);
		const legendLabels = Array.from(container.querySelectorAll(".highcharts-legend-item")).map(
			(node) => node.textContent,
		);
		expect(legendLabels).toEqual(["Axial", "Horizontal", "Radial"]);
	});

	it("renders no series when there is no matching data", () => {
		const { container } = render(<AccelerationChart readings={[]} />);
		expect(container.querySelectorAll(".highcharts-legend-item")).toHaveLength(0);
	});
});
