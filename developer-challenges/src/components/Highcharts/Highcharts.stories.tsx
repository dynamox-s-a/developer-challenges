import type { Meta, StoryObj } from "@storybook/react-vite";
import { Highcharts } from "./Highcharts";

// mock data feita com IA para simular os dados para a demo
const mockSeries = (
	points: number,
	base: number,
	amplitude: number,
	seed: number,
): [number, number][] => {
	const start = Date.UTC(2023, 10, 7, 12, 0, 0);
	const stepMs = 4 * 60 * 60 * 1000;

	return Array.from({ length: points }, (_, i) => {
		const timestamp = start + i * stepMs;
		const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
		const noise = (x - Math.floor(x)) * 2 - 1;
		const value = Math.max(0, base + amplitude * noise);
		return [timestamp, Number(value.toFixed(3))];
	});
};

const meta = {
	title: "Charts/Highcharts",
	component: Highcharts,
} satisfies Meta<typeof Highcharts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Acceleration: Story = {
	args: {
		yAxisTitle: "Métrica (teste)",
		series: [
			{ name: "Data 1", data: mockSeries(60, 6, 3, 1) },
			{ name: "Data 2", data: mockSeries(60, 8, 3, 2) },
			{ name: "Data 3", data: mockSeries(60, 4, 2, 3) },
		],
	},
};
