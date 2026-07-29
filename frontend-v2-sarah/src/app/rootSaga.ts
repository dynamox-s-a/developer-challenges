import { all } from 'redux-saga/effects';
import { dataSaga } from '../features/data/dataSaga';

export default function* rootSaga() {
  yield all([dataSaga()]);
}
