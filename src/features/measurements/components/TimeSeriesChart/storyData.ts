import type { DataPoint, MeasurementSeries } from '@/features/measurements/model/types';

const timestamps = [
	Date.UTC(2024, 0, 1, 12),
	Date.UTC(2024, 0, 2, 12),
	Date.UTC(2024, 0, 3, 12),
	Date.UTC(2024, 0, 4, 12),
	Date.UTC(2024, 0, 5, 12),
	Date.UTC(2024, 0, 6, 12),
];

function createPoints(values: number[]): DataPoint[] {
	return values.map((value, index) => ({
		timestamp: timestamps[index] ?? timestamps[0] ?? 0,
		value,
	}));
}

export const temperatureSeries: MeasurementSeries[] = [
	{
		axis: null,
		data: createPoints([26.2, 26.8, 27.1, 28.4, 27.9, 28.7]),
		id: 'temperature',
		metric: 'temperature',
		name: 'temperature',
		unit: '°C',
	},
];

export const accelerationSeries: MeasurementSeries[] = [
	{
		axis: 'x',
		data: createPoints([0.42, 0.48, 0.45, 0.56, 0.51, 0.58]),
		id: 'acceleration-x',
		metric: 'accelerationRms',
		name: 'accelerationRms/x',
		unit: 'g',
	},
	{
		axis: 'y',
		data: createPoints([0.35, 0.38, 0.41, 0.39, 0.46, 0.44]),
		id: 'acceleration-y',
		metric: 'accelerationRms',
		name: 'accelerationRms/y',
		unit: 'g',
	},
	{
		axis: 'z',
		data: createPoints([0.62, 0.65, 0.61, 0.72, 0.69, 0.75]),
		id: 'acceleration-z',
		metric: 'accelerationRms',
		name: 'accelerationRms/z',
		unit: 'g',
	},
];
