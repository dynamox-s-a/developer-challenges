import { memo } from "react";
import { Highcharts, type HighchartsSeries } from "../../../../components/Highcharts/Highcharts";
import type { RawSeries } from "../../../../features/machineData/types";

export interface TemperatureChartProps {
	readings: RawSeries[];
}

function TemperatureChartComponent({ readings }: TemperatureChartProps) {
	const temperature = readings.find((reading) => reading.name === "temperature");

	const series: HighchartsSeries[] = temperature
		? [
				{
					name: "Temperatura",
					data: temperature.data
						.map((point): [number, number] => [Date.parse(point.datetime), point.max])
						.sort((a, b) => a[0] - b[0]),
				},
			]
		: [];

	return <Highcharts yAxisTitle="Temperatura (°C)" series={series} />;
}

export const TemperatureChart = memo(TemperatureChartComponent);

export default TemperatureChart;
