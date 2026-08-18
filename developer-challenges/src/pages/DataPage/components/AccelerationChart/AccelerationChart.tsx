import { memo } from "react";
import { Highcharts, type HighchartsSeries } from "../../../../components/Highcharts/Highcharts";
import type { RawSeries } from "../../../../features/machineData/types";

const AXIS_LABELS: Record<string, string> = {
	x: "Axial",
	y: "Horizontal",
	z: "Radial",
};

export interface AccelerationChartProps {
	readings: RawSeries[];
}

function AccelerationChartComponent({ readings }: AccelerationChartProps) {
	const series: HighchartsSeries[] = readings
		.filter((reading) => reading.name.startsWith("accelerationRms/"))
		.map((reading) => {
			const axis = reading.name.split("/")[1];
			return {
				name: AXIS_LABELS[axis] ?? axis,
				data: reading.data
					.map((point): [number, number] => [Date.parse(point.datetime), point.max])
					.sort((a, b) => a[0] - b[0]),
			};
		});

	return <Highcharts yAxisTitle="Aceleração RMS (g)" series={series} />;
}

export const AccelerationChart = memo(AccelerationChartComponent);

export default AccelerationChart;
