import { all, fork } from 'redux-saga/effects';

import { dataSaga } from './data/sagas';

export function* rootSaga() {
  yield all([fork(dataSaga)]);
}
