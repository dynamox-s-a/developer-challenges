// src/store/modules/sensorSaga.ts
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchAllMetrics } from '../../services/api';
import { fetchDataRequest, fetchDataSuccess, fetchDataFailure } from './sensorSlice';

// 👇 Adicione 'export' aqui
export function* fetchDataSaga() {
  try {
    const response: Awaited<ReturnType<typeof fetchAllMetrics>> = yield call(fetchAllMetrics);
    console.log('📦 Dados recebidos na saga:', response);
    console.log('📌 É array?', Array.isArray(response));
    yield put(fetchDataSuccess(response));
  } catch (error: any) {
    console.error('❌ Erro na saga:', error);
    yield put(fetchDataFailure(error.message || 'Erro ao buscar dados'));
  }
}

export function* watchSensorSaga() {
  yield takeLatest(fetchDataRequest.type, fetchDataSaga);
}