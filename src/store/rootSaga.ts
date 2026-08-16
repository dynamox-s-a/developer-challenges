import { all } from 'redux-saga/effects';
import { measurementsSaga } from '@/features/measurements/store/saga';

export function* rootSaga() {
	yield all([measurementsSaga()]);
}
