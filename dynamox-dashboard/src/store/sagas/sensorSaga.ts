import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchDataRequest, fetchDataSuccess, fetchDataFailure } from '../sensorSlice';
import { dataService } from '../../services/dataService';
import type { SensorData } from '../../types/sensor';

function* fetchSensorData(): Generator<any, void, any> {
  try {
    // Usar o serviço de dados inteligente
    const result: { data: SensorData[]; source: string } = yield call([dataService, 'fetchSensorData']);
    
    
    yield put(fetchDataSuccess(result.data));
  } catch (error: any) {
    yield put(fetchDataFailure(error.message || 'Erro ao buscar dados'));
  }
}

export function* watchFetchSensorData() {
  yield takeEvery(fetchDataRequest.type, fetchSensorData);
}
