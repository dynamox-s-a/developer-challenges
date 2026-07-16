import { all, fork } from 'redux-saga/effects';

import { watchFetchMachines } from './machines/saga';
import { watchFetchMeasurements } from './measurements/saga';

export function* rootSaga() {
  yield all([fork(watchFetchMachines), fork(watchFetchMeasurements)]);
}
