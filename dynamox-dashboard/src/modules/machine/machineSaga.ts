import { call, put, takeLatest } from 'redux-saga/effects'
import { fetchMachine } from './machineService'
import { loadMachine, loadMachineFailure, loadMachineSuccess } from './machineSlice'
import type { IMachineInfo } from './types'

function* handleLoadMachine() {
  try {
    const machine: IMachineInfo = yield call(fetchMachine)
    yield put(loadMachineSuccess(machine))
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to fetch machine data'

    yield put(loadMachineFailure(message))
  }
}

export function* machineSaga() {
  yield takeLatest(loadMachine.type, handleLoadMachine)
}
