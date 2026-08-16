import type { HTMLAttributes } from 'react';
import Highcharts from 'highcharts';
import { render, screen } from '@testing-library/react';
import type { MeasurementSeries } from '@/features/measurements/model/types';
import { localizeChartSvgDescription, TimeSeriesChart } from '.';

vi.mock('highcharts-react-official', () => ({
	HighchartsReact: ({
		containerProps,
		options,
	}: {
		containerProps: HTMLAttributes<HTMLDivElement>;
		options: Highcharts.Options;
	}) => (
		<div {...containerProps} data-series-count={options.series?.length ?? 0}>
			Highcharts
		</div>
	),
}));

function createSeries(axis: MeasurementSeries['axis']): MeasurementSeries {
	return {
		axis,
		data: [{ timestamp: 1_699_357_200_000, value: 1 }],
		id: axis ?? 'temperature',
		metric: axis === null ? 'temperature' : 'accelerationRms',
		name: axis ?? 'temperature',
		unit: axis === null ? '°C' : 'g',
	};
}

describe('TimeSeriesChart', () => {
	it('configures Highcharts accessibility text for Brazilian Portuguese', () => {
		expect(Highcharts.getOptions().lang).toMatchObject({
			accessibility: {
				chartContainerLabel: '{title}. Gráfico interativo.',
				graphicContainerLabel: '{title}. Gráfico interativo.',
				legend: { legendItem: 'Exibir {itemName}' },
				svgContainerLabel: 'Gráfico interativo.',
				svgContainerTitle: 'Gráfico interativo',
			},
			locale: 'pt-BR',
		});
	});

	it('replaces the generated SVG description with localized chart context', () => {
		const container = document.createElement('div');
		container.innerHTML = '<svg><desc>Created with Highcharts</desc></svg>';

		localizeChartSvgDescription(
			{ container },
			'Aceleração RMS. Gráfico temporal com valores em g.',
		);

		expect(container.querySelector('desc')).toHaveTextContent(
			'Aceleração RMS. Gráfico temporal com valores em g.',
		);
	});

	it.each([
		[['x'] as const, '1'],
		[['z', 'x', 'y'] as const, '3'],
	])('renders %s series through the Highcharts boundary', (axes, expectedCount) => {
		render(
			<TimeSeriesChart
				chartId="measurement-chart"
				labelledBy="measurement-title"
				series={axes.map(createSeries)}
				title="Aceleração RMS"
				unit="g"
			/>,
		);

		expect(screen.getByText('Highcharts')).toHaveAttribute('data-series-count', expectedCount);
		expect(screen.getByText('Highcharts')).toHaveAttribute('aria-labelledby', 'measurement-title');
	});

	it('unregisters the chart instance when unmounted', () => {
		const onChartReady = vi.fn();
		const { unmount } = render(
			<TimeSeriesChart
				chartId="temperature-chart"
				onChartReady={onChartReady}
				series={[createSeries(null)]}
				title="Temperatura"
				unit="°C"
			/>,
		);

		unmount();

		expect(onChartReady).toHaveBeenCalledWith(null);
	});
});
