import { call, put, all, takeLatest, AllEffect, CallEffect, PutEffect } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { fetchEndpoint } from '../services/api';
import { CombinedData, Data, FetchDataFailureAction, FetchDataSuccessAction } from '../interfaces/types';
import { FETCH_DATA_REQUEST, fetchDataFailure, fetchDataSuccess } from './actions';

function* fetchData(): Generator<AllEffect<CallEffect<AxiosResponse<Data>>> | PutEffect<FetchDataSuccessAction | FetchDataFailureAction>, void, AxiosResponse<Data>[]> {
  try {
    const responses: AxiosResponse<Data>[] = yield all([
      call(fetchEndpoint, 0),
      call(fetchEndpoint, 1),
      call(fetchEndpoint, 2),
      call(fetchEndpoint, 3),
      call(fetchEndpoint, 4),
      call(fetchEndpoint, 5),
      call(fetchEndpoint, 6),
    ]);

    const combinedData: CombinedData = {
      time: responses[0].data.data.map((point) => point.datetime),
      acceleration: {
        x: { ...responses[0].data, name: 'Axial' },
        y: { ...responses[1].data, name: 'Horizontal' },
        z: { ...responses[2].data, name: 'Radial' },
      },
      velocity: {
        x: responses[3].data,
        y: responses[4].data,
        z: responses[5].data,
      },
      temperature: responses[6].data,
    };

    yield put(fetchDataSuccess(combinedData));
  } catch (error) {
    if (error instanceof Error) {
      yield put(fetchDataFailure(error.message));
    } else {
      yield put(fetchDataFailure(`Unknown error ${error}`));
    }
  }
}

export default function* rootSaga() {
  yield takeLatest(FETCH_DATA_REQUEST, fetchData);
}
