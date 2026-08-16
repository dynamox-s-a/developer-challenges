import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import * as measurementsService from '../api/measurementsService';
import type { MeasurementsApiResponse } from '../api/types';
import { mapMeasurements } from '../model/mapper';
import { measurementsFailed, measurementsRequested, measurementsSucceeded } from './slice';
import { fetchMeasurementsSaga } from './saga';

const mockRaw: MeasurementsApiResponse = [
	{
		id: 'accelerationRms-x',
		name: 'accelerationRms/x',
		data: [{ datetime: '2023-11-07T11:53:38.187Z', max: 1.5 }],
	},
	{
		id: 'temperature',
		name: 'temperature',
		data: [{ datetime: '2023-11-07T12:00:00.000Z', max: 25.0 }],
	},
];

describe('measurementsSaga', () => {
	it('fetches measurements and dispatches success on happy path', () => {
		const mapped = mapMeasurements(mockRaw);

		return expectSaga(fetchMeasurementsSaga)
			.provide([[matchers.call.fn(measurementsService.getAll), mockRaw]])
			.put(measurementsSucceeded(mapped))
			.run();
	});

	it('dispatches failure when service throws', () => {
		const error = new Error('Network error');

		return expectSaga(fetchMeasurementsSaga)
			.provide([[matchers.call.fn(measurementsService.getAll), throwError(error)]])
			.put(measurementsFailed('Network error'))
			.run();
	});

	it('dispatches failure with generic message for non-Error throws', () => {
		return expectSaga(fetchMeasurementsSaga)
			.provide([
				[
					matchers.call.fn(measurementsService.getAll),
					throwError('string error' as unknown as Error),
				],
			])
			.put(measurementsFailed('Unknown error'))
			.run();
	});

	it('responds to measurementsRequested action', () => {
		const mapped = mapMeasurements(mockRaw);

		return expectSaga(fetchMeasurementsSaga)
			.provide([[matchers.call.fn(measurementsService.getAll), mockRaw]])
			.dispatch(measurementsRequested())
			.put(measurementsSucceeded(mapped))
			.run();
	});
});
