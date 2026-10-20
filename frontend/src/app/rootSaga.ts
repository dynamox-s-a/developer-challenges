import { all } from "redux-saga/effects";
import { watchFetchData } from "../features/data/dataSaga";

export function* rootSaga() {
  yield all([watchFetchData()]);
}
