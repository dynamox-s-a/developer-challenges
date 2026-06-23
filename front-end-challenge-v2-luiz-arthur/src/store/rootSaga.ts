import { all, fork } from 'redux-saga/effects';
import { watchSensorSaga } from './modules/sensorSaga';

export default function* rootSaga() {
  yield all([
    fork(watchSensorSaga),
  ]);
}