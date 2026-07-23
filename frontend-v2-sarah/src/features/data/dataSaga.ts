import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import type { CallEffect, PutEffect } from 'redux-saga/effects';
import type { MetricsResponse } from './types';
import {
  fetchMetricsSuccess,
  fetchMetricsFailure,
  fetchMetricsRequest,
} from './dataSlice';
import { getMetrics } from './dataService';
import { ERROR_MESSAGES } from './constants';

function* fetchMetricsSaga(): Generator<
  CallEffect<MetricsResponse> | PutEffect,
  void,
  MetricsResponse
> {
  try {
    const data = yield call(getMetrics);
    yield put(fetchMetricsSuccess(data));
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      yield put(fetchMetricsFailure(error.message));
      return;
    }

    yield put(fetchMetricsFailure(ERROR_MESSAGES.FETCH_METRICS));
  }
}

export function* dataSaga() {
  yield takeLatest(fetchMetricsRequest.type, fetchMetricsSaga);
}
