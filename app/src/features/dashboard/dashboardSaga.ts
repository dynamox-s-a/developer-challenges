import { call, put, takeLatest } from "redux-saga/effects";
import {
  measurementsFailed,
  measurementsRequested,
  measurementsSucceeded,
} from "./dashboardSlice";
import type { MeasurementSeries } from "./types";

export async function fetchMeasurements(): Promise<MeasurementSeries[]> {
  const response = await fetch("/api/measurements", {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Não foi possível consultar os sensores (${response.status}).`);
  }

  return response.json() as Promise<MeasurementSeries[]>;
}

export function* loadMeasurements() {
  try {
    const measurements: MeasurementSeries[] = yield call(fetchMeasurements);
    yield put(measurementsSucceeded(measurements));
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Ocorreu um erro inesperado ao consultar os sensores.";
    yield put(measurementsFailed(message));
  }
}

export function* dashboardSaga() {
  yield takeLatest(measurementsRequested.type, loadMeasurements);
}
