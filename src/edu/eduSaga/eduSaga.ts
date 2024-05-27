// import { call, put, takeEvery } from 'redux-saga/effects'
// import { getMeasuresSuccess } from '../../store/slices/measuresSlice';

// function* workGetMeasuresFetch(){
//   const response = yield call(() => fetch('https://localhost:3333/data'));
//   const measures = yield response.json(); // Convertendo a resposta para JSON
//   yield put(getMeasuresSuccess(measures))
// }

// function* measuresSaga(){
//   yield takeEvery('measuresSlice/getMeasures', workGetMeasuresFetch)
// }

// export default measuresSaga

// // call -> Allow call URLS and API's
// // put -> call our actions
// // takeEvery -> watch a function and trigger

// // yield -> terminologia da função geradora - similar ao async await
