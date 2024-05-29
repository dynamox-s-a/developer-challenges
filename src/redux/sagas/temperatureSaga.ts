import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { fetchTemperatureRequest, fetchTemperatureSuccess, fetchTemperatureFailure } from '../slices/temperatureSlice';
import { TemperatureResponse } from '../../types';

function* fetchTemperatureData(): Generator {
  try {
    const response = yield call(axios.get, 'http://localhost:4000/6');
    const data = (response as { data: TemperatureResponse }).data;

    yield put(fetchTemperatureSuccess(data.data));
  } catch (error: any) {
    yield put(fetchTemperatureFailure(error.message));
  }
}

function* watchFetchTemperatureData() {
  yield takeLatest(fetchTemperatureRequest.type, fetchTemperatureData);
}

export default watchFetchTemperatureData;
