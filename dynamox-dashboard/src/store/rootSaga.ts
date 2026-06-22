import { all } from 'redux-saga/effects'
import { measurementsSaga } from '../modules/measurements/measurementsSaga'

export function* rootSaga() {
  yield all([measurementsSaga()])
}
