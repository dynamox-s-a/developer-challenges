import { call, put, takeEvery } from 'redux-saga/effects'
import { getMachineDataSuccess, MachineItem } from '../slices/machineSlice';

function* workGetMeasuresFetch(){
  const response: Response = yield call(() => fetch('http://localhost:3333/machine'));
  const formattedResponse: MachineItem[] = yield response.json(); // Convertendo a resposta para JSON
  yield put(getMachineDataSuccess(formattedResponse))
}

function* machineSaga(){
  yield takeEvery('machineSlice/getMachineDataFetch', workGetMeasuresFetch)
}

export default machineSaga

// call -> Allow call URLS and API's
// put -> call our actions
// takeEvery -> watch a function and trigger

// yield -> terminologia da função geradora - similar ao async await
