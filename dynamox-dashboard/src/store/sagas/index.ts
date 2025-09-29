import { all } from 'redux-saga/effects';
import { watchFetchSensorData } from './sensorSaga';

export function* rootSaga() {
  yield all([
    watchFetchSensorData()
  ]);
}
