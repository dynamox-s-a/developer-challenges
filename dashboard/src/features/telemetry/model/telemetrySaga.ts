import { call, cancelled, put, takeLatest } from "redux-saga/effects";
import { fetchTelemetry } from "../api/telemetryApi";
import { telemetryActions } from "./telemetrySlice";
import type { TelemetryResponse } from "./types";
export function* fetchTelemetryWorker(): Generator<
  unknown,
  void,
  TelemetryResponse | boolean
> {
  const controller = new AbortController();
  try {
    const data = (yield call(
      fetchTelemetry,
      controller.signal,
    )) as TelemetryResponse;
    yield put(telemetryActions.fetchSucceeded(data));
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return;
    yield put(
      telemetryActions.fetchFailed(
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
      ),
    );
  } finally {
    if (yield cancelled()) controller.abort();
  }
}
function* handleTelemetryAction(
  action:
    | ReturnType<typeof telemetryActions.fetchRequested>
    | ReturnType<typeof telemetryActions.fetchCancelled>,
): Generator {
  if (telemetryActions.fetchRequested.match(action))
    yield call(fetchTelemetryWorker);
}
export function* telemetrySaga(): Generator {
  yield takeLatest(
    [
      telemetryActions.fetchRequested.type,
      telemetryActions.fetchCancelled.type,
    ],
    handleTelemetryAction,
  );
}
