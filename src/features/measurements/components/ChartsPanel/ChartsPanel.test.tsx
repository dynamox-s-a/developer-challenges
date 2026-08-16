import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { MeasurementSeries } from '@/features/measurements/model/types';
import { ChartsPanel } from '.';

vi.mock('@/features/measurements/components/TimeSeriesChart', () => ({
	TimeSeriesChart: ({
		title,
		series,
	}: {
		title: string;
		series: Array<{ axis: string | null }>;
	}) => (
		<div role="img" aria-label={title} data-series-count={series.length}>
			{title}
		</div>
	),
}));

function createSeries(
	id: string,
	metric: MeasurementSeries['metric'],
	axis: MeasurementSeries['axis'],
): MeasurementSeries {
	return {
		axis,
		data: [{ timestamp: 1_699_357_200_000, value: 1 }],
		id,
		metric,
		name: id,
		unit: metric === 'temperature' ? '°C' : metric === 'velocityRms' ? 'mm/s' : 'g',
	};
}

function renderPanel(data: MeasurementSeries[]) {
	const store = configureStore({
		reducer: {
			measurements: () => ({ data, error: null, status: 'success' as const }),
		},
	});

	return render(
		<Provider store={store}>
			<ChartsPanel />
		</Provider>,
	);
}

describe('ChartsPanel', () => {
	it('renders charts in Figma order with 3/1/3 series', () => {
		renderPanel([
			createSeries('velocity-z', 'velocityRms', 'z'),
			createSeries('acceleration-y', 'accelerationRms', 'y'),
			createSeries('temperature', 'temperature', null),
			createSeries('acceleration-x', 'accelerationRms', 'x'),
			createSeries('velocity-x', 'velocityRms', 'x'),
			createSeries('acceleration-z', 'accelerationRms', 'z'),
			createSeries('velocity-y', 'velocityRms', 'y'),
		]);

		expect(
			screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent),
		).toEqual(['Aceleração RMS', 'Temperatura', 'Velocidade RMS']);
		expect(screen.getByRole('img', { name: 'Aceleração RMS' })).toHaveAttribute(
			'data-series-count',
			'3',
		);
		expect(screen.getByRole('img', { name: 'Temperatura' })).toHaveAttribute(
			'data-series-count',
			'1',
		);
		expect(screen.getByRole('img', { name: 'Velocidade RMS' })).toHaveAttribute(
			'data-series-count',
			'3',
		);
	});

	it('renders all charts when metric series are incomplete', () => {
		renderPanel([
			createSeries('acceleration-x', 'accelerationRms', 'x'),
			createSeries('temperature', 'temperature', null),
		]);

		expect(screen.getAllByRole('img')).toHaveLength(3);
		expect(screen.getByRole('img', { name: 'Velocidade RMS' })).toHaveAttribute(
			'data-series-count',
			'0',
		);
	});
});
