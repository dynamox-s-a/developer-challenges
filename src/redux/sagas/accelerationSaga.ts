import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
  fetchAccelerationRequest,
  fetchAccelerationXSuccess,
  fetchAccelerationYSuccess,
  fetchAccelerationZSuccess,
  fetchAccelerationFailure,
} from '../slices/accelerationSlice';
import { AccelerationResponse } from '../../types';

function* fetchAccelerationData(): Generator {
  try {
    const responseX = yield call(axios.get, 'http://localhost:4000/0');
    const dataX = (responseX as { data: AccelerationResponse }).data;

    const responseY = yield call(axios.get, 'http://localhost:4000/1');
    const dataY = (responseY as { data: AccelerationResponse }).data;

    const responseZ = yield call(axios.get, 'http://localhost:4000/2');
    const dataZ = (responseZ as { data: AccelerationResponse }).data;

    yield put(fetchAccelerationXSuccess(dataX.data));
    yield put(fetchAccelerationYSuccess(dataY.data));
    yield put(fetchAccelerationZSuccess(dataZ.data));
  } catch (error: any) {
    yield put(fetchAccelerationFailure(error.message));
  }
}

function* watchFetchAccelerationData() {
  yield takeLatest(fetchAccelerationRequest.type, fetchAccelerationData);
}

export default watchFetchAccelerationData;
