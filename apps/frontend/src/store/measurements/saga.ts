import type { PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { getOrpcErrorMessage, orpcClient } from 'src/lib/orpc-client';

import type { RootState } from '../root-reducer';
import { periodToRange } from './period';
import { fetchMeasurements, fetchMeasurementsFailed, fetchMeasurementsSucceeded } from './slice';

type MeasurementsResponse = Awaited<ReturnType<typeof orpcClient.measurements.list>>;

function* fetchMeasurementsSaga({ payload }: PayloadAction<{ machineId: string }>) {
  try {
    const { machineId } = payload;

    const period: RootState['measurements']['period'] = yield select(
      (state: RootState) => state.measurements.period
    );

    const lastReadingAt: string | undefined = yield select(
      (state: RootState) => state.machines.items.find((machine) => machine.id === machineId)?.lastReadingAt
    );

    const response: MeasurementsResponse = yield call(() =>
      orpcClient.measurements.list({ machineId, ...periodToRange(period, lastReadingAt) })
    );

    yield put(fetchMeasurementsSucceeded(response.series));
  } catch (error) {
    yield put(fetchMeasurementsFailed(getOrpcErrorMessage(error)));
  }
}

export function* watchFetchMeasurements() {
  yield takeLatest(fetchMeasurements.type, fetchMeasurementsSaga);
}
