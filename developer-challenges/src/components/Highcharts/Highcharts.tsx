import { forwardRef } from "react";
import HC from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import type { HighchartsReactRefObject } from "highcharts-react-official";

HC.setOptions({
	lang: {
		months: [
			"Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
			"Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
		],
		shortMonths: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
		weekdays: [
			"Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
			"Quinta-feira", "Sexta-feira", "Sábado",
		],
	},
});

const SERIES_COLORS = ["#2a78d6", "#e87ba4", "#eda100"];
const GRIDLINE_COLOR = "#e1e0d9";
const AXIS_LINE_COLOR = "#c3c2b7";
const AXIS_LABEL_COLOR = "#898781";
const AXIS_TITLE_COLOR = "#52514e";
const CHART_SURFACE_COLOR = "#fcfcfb";

export interface HighchartsSeries {
	name: string;
	data: [number, number][];
}

export interface HighchartsProps {
	yAxisTitle: string;
	series: HighchartsSeries[];
}

export const Highcharts = forwardRef<HighchartsReactRefObject, HighchartsProps>(
	({ yAxisTitle, series }, ref) => {
		const options: HC.Options = {
			chart: {
				backgroundColor: CHART_SURFACE_COLOR,
				zooming: { type: "x" },
				style: { fontFamily: "inherit" },
			},
			title: { text: undefined },
			colors: SERIES_COLORS,
			xAxis: {
				type: "datetime",
				dateTimeLabelFormats: { day: { main: "%e. %b" } },
				gridLineWidth: 1,
				gridLineColor: GRIDLINE_COLOR,
				lineColor: AXIS_LINE_COLOR,
				tickColor: AXIS_LINE_COLOR,
				labels: { style: { color: AXIS_LABEL_COLOR } },
				crosshair: { width: 1, color: AXIS_LINE_COLOR },
			},
			yAxis: {
				title: { text: yAxisTitle, style: { color: AXIS_TITLE_COLOR } },
				min: 0,
				gridLineWidth: 1,
				gridLineColor: GRIDLINE_COLOR,
				lineColor: AXIS_LINE_COLOR,
				labels: { style: { color: AXIS_LABEL_COLOR } },
			},
			legend: {
				enabled: true,
				align: "center",
				verticalAlign: "bottom",
				itemStyle: { color: AXIS_TITLE_COLOR, fontWeight: "bold" },
			},
			plotOptions: {
				series: {
					lineWidth: 2,
					linecap: "square",
					marker: { enabled: false, symbol: "circle" },
				},
			},
			tooltip: {
				shared: true,
				xDateFormat: "%d/%m/%Y %H:%M",
			},
			series: series.map((s) => ({
				type: "line",
				name: s.name,
				data: s.data,
			})),
			credits: { enabled: false },
		};

		return <HighchartsReact ref={ref} highcharts={HC} options={options} />;
	},
);

Highcharts.displayName = "Highcharts";

export default Highcharts;
