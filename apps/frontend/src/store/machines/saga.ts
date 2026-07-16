import { call, put, takeLatest } from 'redux-saga/effects';

import { getOrpcErrorMessage, orpcClient } from 'src/lib/orpc-client';

import { fetchMachines, fetchMachinesFailed, fetchMachinesSucceeded } from './slice';

type MachinesResponse = Awaited<ReturnType<typeof orpcClient.machines.list>>;

function* fetchMachinesSaga() {
  try {
    const response: MachinesResponse = yield call(() => orpcClient.machines.list());

    yield put(fetchMachinesSucceeded(response.data));
  } catch (error) {
    yield put(fetchMachinesFailed(getOrpcErrorMessage(error)));
  }
}

export function* watchFetchMachines() {
  yield takeLatest(fetchMachines.type, fetchMachinesSaga);
}
