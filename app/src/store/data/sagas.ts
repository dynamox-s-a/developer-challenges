import { call, put, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';

import { api } from '../../services/api';
import { fetchDataFailure, fetchDataSuccess } from './actions';
import { DataActionTypes } from './types';

export function* fetchDataSaga() {
  try {
    const data = yield call(api.getData);

    yield put(fetchDataSuccess(data));
  } catch {
    yield put(fetchDataFailure('Não foi possível carregar os dados.'));
  }
}

export function* dataSaga(): SagaIterator {
  yield takeLatest(DataActionTypes.FETCH_REQUEST, fetchDataSaga);
}
