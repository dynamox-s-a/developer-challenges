import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
  fetchVelocityRmsRequest,
  fetchVelocityRmsXSuccess,
  fetchVelocityRmsYSuccess,
  fetchVelocityRmsZSuccess,
  fetchVelocityRmsFailure,
} from '../slices/velocityRmsSlice';
import { VelocityRmsResponse } from '../../types';

function* fetchVelocityRmsData(): Generator {
  try {
    const responseX = yield call(axios.get, 'http://localhost:4000/3');
    const dataX = (responseX as { data: VelocityRmsResponse }).data;

    const responseY = yield call(axios.get, 'http://localhost:4000/4');
    const dataY = (responseY as { data: VelocityRmsResponse }).data;

    const responseZ = yield call(axios.get, 'http://localhost:4000/5');
    const dataZ = (responseZ as { data: VelocityRmsResponse }).data;

    yield put(fetchVelocityRmsXSuccess(dataX.data));
    yield put(fetchVelocityRmsYSuccess(dataY.data));
    yield put(fetchVelocityRmsZSuccess(dataZ.data));
  } catch (error: any) {
    yield put(fetchVelocityRmsFailure(error.message));
  }
}

function* watchFetchVelocityRmsData() {
  yield takeLatest(fetchVelocityRmsRequest.type, fetchVelocityRmsData);
}

export default watchFetchVelocityRmsData;
