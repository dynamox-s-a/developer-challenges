import type { Axis, MeasurementSeries } from '../../model/types';
import { designColors } from '@/theme/colors';
import { buildLineSeries, createChartOptions } from './chartOptions';

function createSeries(axis: Axis, value = 1): MeasurementSeries {
	return {
		axis,
		data: [{ timestamp: 1_699_357_200_000, value }],
		id: axis ?? 'temperature',
		metric: axis === null ? 'temperature' : 'accelerationRms',
		name: axis === null ? 'temperature' : `accelerationRms/${axis}`,
		unit: axis === null ? '°C' : 'g',
	};
}

describe('chartOptions', () => {
	it('converts data points to Highcharts timestamp/value tuples', () => {
		const [series] = buildLineSeries([createSeries('x', 1.25)]);

		expect(series?.data).toEqual([[1_699_357_200_000, 1.25]]);
	});

	it('orders axis series as X/Y/Z and applies their design colors', () => {
		const series = buildLineSeries([createSeries('z'), createSeries('x'), createSeries('y')]);

		expect(series.map(({ name }) => name)).toEqual(['Axial', 'Horizontal', 'Radial']);
		expect(series.map(({ color }) => color)).toEqual([
			designColors.chart.x,
			designColors.chart.y,
			designColors.chart.z,
		]);
	});

	it('uses the temperature name and color for a series without axis', () => {
		const [series] = buildLineSeries([createSeries(null)]);

		expect(series).toMatchObject({
			color: designColors.chart.temperature,
			name: 'Temperatura',
			type: 'line',
		});
	});

	it('configures titles, units, local datetime, legend and accessibility', () => {
		const options = createChartOptions({
			series: [createSeries('x')],
			title: 'Aceleração RMS',
			unit: 'g',
		});

		expect(options).toMatchObject({
			accessibility: {
				description: 'Aceleração RMS. Gráfico temporal com valores em g.',
				enabled: true,
				keyboardNavigation: { enabled: true },
				screenReaderSection: { beforeChartFormat: '' },
			},
			chart: {
				height: 432,
			},
			legend: {
				align: 'center',
				verticalAlign: 'bottom',
			},
			plotOptions: {
				series: {
					lineWidth: 2,
				},
			},
			responsive: {
				rules: [
					{
						chartOptions: {
							chart: { height: 320 },
							xAxis: {
								labels: { autoRotation: [-45] },
								tickPixelInterval: 80,
							},
						},
						condition: { maxWidth: 600 },
					},
				],
			},
			time: {
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			},
			tooltip: {
				backgroundColor: designColors.paper,
				borderColor: designColors.border,
				shared: true,
				style: {
					color: designColors.text,
					width: 240,
				},
			},
			title: {
				text: 'Aceleração RMS',
			},
			xAxis: {
				labels: {
					formatter: expect.any(Function),
				},
				type: 'datetime',
			},
			yAxis: {
				title: {
					text: 'Aceleração RMS (g)',
				},
			},
		});
	});

	it('builds valid options for an empty data set', () => {
		const options = createChartOptions({
			series: [],
			title: 'Temperatura',
			unit: '°C',
		});

		expect(options.series).toEqual([]);
	});
});
