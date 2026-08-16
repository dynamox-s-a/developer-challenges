import type { MeasurementsApiResponse } from '../api/types';
import type { Axis, MeasurementSeries, Metric } from './types';

const UNIT_MAP: Record<Metric, string> = {
	accelerationRms: 'g',
	velocityRms: 'mm/s',
	temperature: '°C',
};

function parseMetricAndAxis(name: string): { metric: Metric; axis: Axis } {
	const slashIndex = name.indexOf('/');
	if (slashIndex === -1) {
		return { metric: name as Metric, axis: null };
	}
	return {
		metric: name.slice(0, slashIndex) as Metric,
		axis: name.slice(slashIndex + 1) as Axis,
	};
}

export function mapMeasurements(raw: MeasurementsApiResponse): MeasurementSeries[] {
	return raw.map((item) => {
		const { metric, axis } = parseMetricAndAxis(item.name);
		return {
			id: item.id,
			name: item.name,
			metric,
			axis,
			unit: UNIT_MAP[metric],
			data: item.data.map((point) => ({
				timestamp: new Date(point.datetime).getTime(),
				value: point.max,
			})),
		};
	});
}
