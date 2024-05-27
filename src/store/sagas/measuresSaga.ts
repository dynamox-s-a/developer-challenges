import { call, put, takeEvery } from 'redux-saga/effects'
import { getMeasuresSuccess } from '../slices/measuresSlice'
import { Measure } from '../../@types/types';

function* workGetMeasuresFetch(){
  const response: Response = yield call(() => fetch('http://localhost:3333/data'));
  const formattedResponse: Measure[] = yield response.json(); // Convertendo a resposta para JSON
  yield put(getMeasuresSuccess(formattedResponse))
}

function* measuresSaga(){
  yield takeEvery('measuresSlice/getMeasuresFetch', workGetMeasuresFetch)
}

export default measuresSaga

// call -> Allow call URLS and API's
// put -> call our actions
// takeEvery -> watch a function and trigger

// yield -> terminologia da função geradora - similar ao async await
