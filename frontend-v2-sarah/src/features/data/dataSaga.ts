import {
  call,
  put,
  takeLatest,
  type CallEffect,
  type PutEffect,
} from 'redux-saga/effects';
import { getMetrics } from '../../services/metrics/metrics.service';
import { getErrorMessage } from '../../utils/errorUtils';
import {
  fetchMetricsSuccess,
  fetchMetricsFailure,
  fetchMetricsRequest,
} from './dataSlice';
import type { MetricsResponse } from './types';

export function* fetchMetricsSaga(): Generator<
  CallEffect<MetricsResponse> | PutEffect,
  void,
  MetricsResponse
> {
  try {
    const data = yield call(getMetrics);
    yield put(fetchMetricsSuccess(data));
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    yield put(fetchMetricsFailure(errorMessage));
  }
}

export function* dataSaga() {
  yield takeLatest(fetchMetricsRequest.type, fetchMetricsSaga);
}
