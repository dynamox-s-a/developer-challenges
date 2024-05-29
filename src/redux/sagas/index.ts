import { all } from 'redux-saga/effects';
import watchFetchAccelerationData from './accelerationSaga';
import watchFetchTemperatureData from './temperatureSaga';
import watchFetchVelocityRmsData from './velocityRmsSaga';

export default function* rootSaga() {
  yield all([watchFetchAccelerationData(), watchFetchTemperatureData(), watchFetchVelocityRmsData()]);
}
