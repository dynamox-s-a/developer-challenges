import reducer, {
	measurementsFailed,
	measurementsRequested,
	measurementsSucceeded,
	type MeasurementsState,
} from './slice';
import type { MeasurementSeries } from '@/features/measurements/model/types';

const initialState: MeasurementsState = {
	data: [],
	status: 'idle',
	error: null,
};

const mockSeries: MeasurementSeries[] = [
	{
		id: 'accelerationRms-x',
		name: 'accelerationRms/x',
		metric: 'accelerationRms',
		axis: 'x',
		unit: 'g',
		data: [{ timestamp: 1699357200000, value: 1.2 }],
	},
];

describe('measurementsSlice', () => {
	it('has correct initial state', () => {
		const state = reducer(undefined, { type: '@@INIT' });
		expect(state).toEqual(initialState);
	});

	it('measurementsRequested sets status to loading and clears error', () => {
		const prev: MeasurementsState = { data: [], status: 'error', error: 'fail' };
		const state = reducer(prev, measurementsRequested());
		expect(state.status).toBe('loading');
		expect(state.error).toBeNull();
	});

	it('measurementsSucceeded sets status to success and populates data', () => {
		const prev: MeasurementsState = { data: [], status: 'loading', error: null };
		const state = reducer(prev, measurementsSucceeded(mockSeries));
		expect(state.status).toBe('success');
		expect(state.data).toEqual(mockSeries);
	});

	it('measurementsFailed sets status to error and populates error message', () => {
		const prev: MeasurementsState = { data: [], status: 'loading', error: null };
		const state = reducer(prev, measurementsFailed('Network error'));
		expect(state.status).toBe('error');
		expect(state.error).toBe('Network error');
	});
});
