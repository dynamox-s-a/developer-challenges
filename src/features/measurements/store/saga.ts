import { call, put, takeLatest } from 'redux-saga/effects';
import * as measurementsService from '@/features/measurements/api/measurementsService';
import { mapMeasurements } from '@/features/measurements/model/mapper';
import type { MeasurementsApiResponse } from '@/features/measurements/api/types';
import type { MeasurementSeries } from '@/features/measurements/model/types';
import { measurementsFailed, measurementsRequested, measurementsSucceeded } from './slice';

export function* fetchMeasurementsSaga() {
	try {
		const raw: MeasurementsApiResponse = yield call(measurementsService.getAll);
		const series: MeasurementSeries[] = mapMeasurements(raw);
		yield put(measurementsSucceeded(series));
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		yield put(measurementsFailed(message));
	}
}

export function* measurementsSaga() {
	yield takeLatest(measurementsRequested.type, fetchMeasurementsSaga);
}
