import { all, call, put, takeLatest } from "redux-saga/effects";
import { machineService } from "../../services/machineService";
import { fetchMachineData, fetchMachineDataSuccess, fetchMachineDataFailure } from "./machineDataSlice";
import type { MachineInfo, RawSeries } from "./types";

function* handleFetchMachineData() {
	try {
		const [machine, readings]: [MachineInfo, RawSeries[]] = yield all([
			call(machineService.getMachine),
			call(machineService.getReadings),
		]);
		yield put(fetchMachineDataSuccess({ machine, readings }));
	} catch (error) {
		yield put(fetchMachineDataFailure(error instanceof Error ? error.message : "Unknown error"));
	}
}

export function* machineDataSaga() {
	yield takeLatest(fetchMachineData.type, handleFetchMachineData);
}
