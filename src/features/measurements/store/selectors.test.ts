import type { RootState } from '@/store';
import type { MeasurementSeries } from '../model/types';
import {
	selectAccelerationSeries,
	selectAllSeries,
	selectMeasurementsError,
	selectMeasurementsStatus,
	selectTemperatureSeries,
	selectVelocitySeries,
} from './selectors';

const mockSeries: MeasurementSeries[] = [
	{
		id: 'accelerationRms-x',
		name: 'accelerationRms/x',
		metric: 'accelerationRms',
		axis: 'x',
		unit: 'g',
		data: [{ timestamp: 1699357200000, value: 1.2 }],
	},
	{
		id: 'accelerationRms-y',
		name: 'accelerationRms/y',
		metric: 'accelerationRms',
		axis: 'y',
		unit: 'g',
		data: [{ timestamp: 1699357200000, value: 0.8 }],
	},
	{
		id: 'velocityRms-x',
		name: 'velocityRms/x',
		metric: 'velocityRms',
		axis: 'x',
		unit: 'mm/s',
		data: [{ timestamp: 1699357200000, value: 3.1 }],
	},
	{
		id: 'temperature',
		name: 'temperature',
		metric: 'temperature',
		axis: null,
		unit: '°C',
		data: [{ timestamp: 1699357200000, value: 25.3 }],
	},
];

function createState(overrides: Partial<RootState['measurements']> = {}): RootState {
	return {
		measurements: {
			data: [],
			status: 'idle',
			error: null,
			...overrides,
		},
	};
}

describe('measurements selectors', () => {
	it('selectMeasurementsStatus returns status', () => {
		const state = createState({ status: 'loading' });
		expect(selectMeasurementsStatus(state)).toBe('loading');
	});

	it('selectMeasurementsError returns error', () => {
		const state = createState({ error: 'fail' });
		expect(selectMeasurementsError(state)).toBe('fail');
	});

	it('selectAllSeries returns all series', () => {
		const state = createState({ data: mockSeries });
		expect(selectAllSeries(state)).toHaveLength(4);
	});

	it('selectAccelerationSeries filters accelerationRms only', () => {
		const state = createState({ data: mockSeries });
		const result = selectAccelerationSeries(state);
		expect(result).toHaveLength(2);
		expect(result.every((s) => s.metric === 'accelerationRms')).toBe(true);
	});

	it('selectVelocitySeries filters velocityRms only', () => {
		const state = createState({ data: mockSeries });
		const result = selectVelocitySeries(state);
		expect(result).toHaveLength(1);
		expect(result[0]?.metric).toBe('velocityRms');
	});

	it('selectTemperatureSeries filters temperature only', () => {
		const state = createState({ data: mockSeries });
		const result = selectTemperatureSeries(state);
		expect(result).toHaveLength(1);
		expect(result[0]?.metric).toBe('temperature');
	});

	it('selectors return empty arrays when data is empty', () => {
		const state = createState({ data: [] });
		expect(selectAllSeries(state)).toEqual([]);
		expect(selectAccelerationSeries(state)).toEqual([]);
		expect(selectVelocitySeries(state)).toEqual([]);
		expect(selectTemperatureSeries(state)).toEqual([]);
	});
});
