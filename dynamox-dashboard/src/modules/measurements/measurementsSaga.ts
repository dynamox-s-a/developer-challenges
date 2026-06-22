import { call, put, takeLatest } from 'redux-saga/effects'
import { fetchMeasurements } from './measurementsService'
import {
  loadMeasurements,
  loadMeasurementsFailure,
  loadMeasurementsSuccess,
} from './measurementsSlice'
import type { IMeasurementsPayload } from './types'

function* handleLoadMeasurements() {
  try {
    const payload: IMeasurementsPayload = yield call(fetchMeasurements)
    yield put(loadMeasurementsSuccess(payload))
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to fetch measurements'

    yield put(loadMeasurementsFailure(message))
  }
}

export function* measurementsSaga() {
  yield takeLatest(loadMeasurements.type, handleLoadMeasurements)
}
