import axios, { AxiosResponse } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchDataFailure, fetchDataRequest, fetchDataSuccess } from '../slices/dataSlice';

interface DataEntry {
  datetime: string;
  max: number;
}

interface DataItem {
  name: string;
  data: DataEntry[];
}

function* fetchDataSaga(): Generator<any, void, AxiosResponse<DataItem[]>> {
  try {
    const response = yield call(axios.get, 'http://localhost:3000/data');
    yield put(fetchDataSuccess(response.data));
  } catch (error: any) {
    yield put(fetchDataFailure(error.message));
  }
}

export function* watchFetchData() {
  yield takeEvery(fetchDataRequest.type, fetchDataSaga);
}
