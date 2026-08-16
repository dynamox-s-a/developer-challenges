import type {
	AxisLabelsFormatterContextObject,
	Options,
	Point,
	SeriesLineOptions,
} from 'highcharts';
import type { Axis, MeasurementSeries } from '../../model/types';
import { designColors } from '@/theme/colors';

const AXIS_ORDER: Record<Exclude<Axis, null>, number> = { x: 0, y: 1, z: 2 };
const AXIS_NAMES: Record<Exclude<Axis, null>, string> = {
	x: 'Axial',
	y: 'Horizontal',
	z: 'Radial',
};
const AXIS_COLORS: Record<Exclude<Axis, null>, string> = {
	x: designColors.chart.x,
	y: designColors.chart.y,
	z: designColors.chart.z,
};

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
	day: 'numeric',
	month: 'short',
});

const tooltipDateFormatter = new Intl.DateTimeFormat('pt-BR', {
	day: '2-digit',
	month: 'short',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
});

const valueFormatter = new Intl.NumberFormat('pt-BR', {
	maximumFractionDigits: 2,
});
const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export interface ChartOptionsInput {
	title: string;
	unit: string;
	series: MeasurementSeries[];
}

export function sortMeasurementSeries(series: MeasurementSeries[]): MeasurementSeries[] {
	return [...series].sort((left, right) => {
		if (left.axis === null) return 1;
		if (right.axis === null) return -1;
		return AXIS_ORDER[left.axis] - AXIS_ORDER[right.axis];
	});
}

export function buildLineSeries(series: MeasurementSeries[]): SeriesLineOptions[] {
	return sortMeasurementSeries(series).map((item) => ({
		color: item.axis === null ? designColors.chart.temperature : AXIS_COLORS[item.axis],
		data: item.data.map(({ timestamp, value }) => [timestamp, value]),
		id: item.id,
		name: item.axis === null ? 'Temperatura' : AXIS_NAMES[item.axis],
		type: 'line',
	}));
}

function formatAxisDate(this: AxisLabelsFormatterContextObject): string {
	return dateFormatter.format(Number(this.value)).replace('.', '');
}

function createTooltipFormatter(unit: string) {
	return function formatTooltip(this: Point): string {
		const timestamp = typeof this.x === 'number' ? this.x : Number(this.key);
		const header = `<b>${tooltipDateFormatter.format(timestamp).replace('.', '')}</b>`;
		const points = this.points ?? [this];
		const rows = points.map((point) => {
			const color = point.color ?? point.series.color;
			return `<span style="color:${color}">●</span> ${point.series.name}: <b>${valueFormatter.format(point.y ?? 0)} ${unit}</b>`;
		});
		return [header, ...rows].join('<br/>');
	};
}

export function createChartOptions({ title, unit, series }: ChartOptionsInput): Options {
	return {
		accessibility: {
			description: `${title}. Gráfico temporal com valores em ${unit}.`,
			enabled: true,
		},
		chart: {
			animation: false,
			backgroundColor: designColors.paper,
			height: 432,
			spacing: [16, 16, 8, 8],
			type: 'line',
		},
		credits: { enabled: false },
		legend: {
			align: 'center',
			itemStyle: {
				color: designColors.text,
				fontSize: '12px',
				fontWeight: '700',
			},
			symbolHeight: 2,
			symbolWidth: 16,
			verticalAlign: 'bottom',
		},
		plotOptions: {
			series: {
				animation: false,
				lineWidth: 2,
				marker: { enabled: false },
				states: { hover: { lineWidthPlus: 0 } },
			},
		},
		responsive: {
			rules: [
				{
					condition: { maxWidth: 600 },
					chartOptions: {
						chart: { height: 320 },
						legend: { itemDistance: 8 },
					},
				},
			],
		},
		series: buildLineSeries(series),
		time: { timezone: browserTimeZone },
		title: {
			style: { display: 'none' },
			text: title,
		},
		tooltip: {
			backgroundColor: designColors.paper,
			borderColor: designColors.border,
			borderRadius: 4,
			borderWidth: 1,
			fixed: false,
			formatter: createTooltipFormatter(unit),
			padding: 10,
			shadow: {
				color: designColors.text,
				offsetX: 0,
				offsetY: 2,
				opacity: 0.12,
				width: 4,
			},
			shared: true,
			style: {
				color: designColors.text,
				fontSize: '12px',
				width: 240,
			},
			useHTML: false,
		},
		xAxis: {
			crosshair: {
				color: designColors.text,
				dashStyle: 'ShortDot',
				width: 1,
			},
			gridLineColor: designColors.border,
			gridLineWidth: 1,
			labels: {
				formatter: formatAxisDate,
				style: { color: designColors.axisLabel, fontSize: '12px' },
			},
			lineColor: designColors.border,
			tickColor: designColors.border,
			type: 'datetime',
		},
		yAxis: {
			gridLineColor: designColors.border,
			labels: { style: { color: designColors.axisLabel, fontSize: '12px' } },
			lineColor: designColors.border,
			lineWidth: 1,
			title: {
				style: { color: designColors.axisLabel, fontSize: '12px' },
				text: `${title} (${unit})`,
			},
		},
	};
}
