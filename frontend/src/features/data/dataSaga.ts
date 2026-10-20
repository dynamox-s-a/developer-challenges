import { all, call, put, takeLatest } from "redux-saga/effects";
import type { MachineDto, SeriesDto } from "./types";
import { fetchMachine, fetchSeries } from "./api";
import {
  fetchDataFailed,
  fetchDataRequested,
  fetchDataSucceeded,
} from "./dataSlice";
import { toChartData } from "./transform";

export function* fetchDataWorker() {
  try {
    const [machine, series]: [MachineDto, SeriesDto[]] = yield all([
      call(fetchMachine),
      call(fetchSeries),
    ]);

    yield put(fetchDataSucceeded({ machine, charts: toChartData(series) }));
  } catch (error) {
    yield put(
      fetchDataFailed(
        error instanceof Error ? error.message : "Failed to load data",
      ),
    );
  }
}

export function* watchFetchData() {
  yield takeLatest(fetchDataRequested.type, fetchDataWorker);
}
