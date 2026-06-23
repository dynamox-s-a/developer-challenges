import { all } from 'redux-saga/effects'
import { machineSaga } from '../modules/machine/machineSaga'
import { measurementsSaga } from '../modules/measurements/measurementsSaga'

export function* rootSaga() {
  yield all([machineSaga(), measurementsSaga()])
}
