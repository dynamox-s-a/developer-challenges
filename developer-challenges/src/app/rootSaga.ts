import { all } from "redux-saga/effects";
import { machineDataSaga } from "../features/machineData/machineDataSaga";

export function* rootSaga() {
	yield all([machineDataSaga()]);
}
