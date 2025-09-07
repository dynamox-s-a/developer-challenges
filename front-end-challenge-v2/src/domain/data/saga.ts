import { call, put, takeLatest } from 'redux-saga/effects'
import { dataFetchFailed, dataFetchRequested, dataFetchSucceeded } from './actions'
import { fetchAllMetrics } from './api'

type MetricsPayload = Awaited<ReturnType<typeof fetchAllMetrics>>

function* handleFetch() {
  try {
    const payload: MetricsPayload = (yield call(fetchAllMetrics)) as MetricsPayload
    yield put(dataFetchSucceeded(payload))
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Erro ao buscar dados'
    yield put(dataFetchFailed(message))
  }
}

export default function* dataSaga() {
  yield takeLatest(dataFetchRequested.type, handleFetch)
}
