import { call, cancelled, put } from "redux-saga/effects";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchTelemetry } from "../api/telemetryApi";
import { fetchTelemetryWorker } from "../model/telemetrySaga";
import { telemetryActions } from "../model/telemetrySlice";

describe("fetchTelemetryWorker", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("emite sucesso após uma resposta de API bem sucedida", () => {
    const response = [{ name: "temperature", data: [] }];
    const saga = fetchTelemetryWorker();
    const request = saga.next().value as ReturnType<typeof call>;
    expect(request.payload.fn).toBe(fetchTelemetry);
    expect(saga.next(response).value).toEqual(
      put(telemetryActions.fetchSucceeded(response)),
    );
    expect(saga.next().value).toEqual(cancelled());
    expect(saga.next(false).done).toBe(true);
  });

  it("emite falha quando a API lança um erro", () => {
    const saga = fetchTelemetryWorker();
    saga.next();
    expect(saga.throw(new Error("offline")).value).toEqual(
      put(telemetryActions.fetchFailed("offline")),
    );
  });

  it("não emite um erro para uma requisição abortada", () => {
    const saga = fetchTelemetryWorker();
    saga.next();
    expect(saga.throw(new DOMException("aborted", "AbortError")).value).toEqual(
      cancelled(),
    );
  });

  it("aborta a requisição em andamento quando o saga é cancelado", () => {
    const abort = vi.fn();
    class MockAbortController {
      signal = {} as AbortSignal;
      abort = abort;
    }
    vi.stubGlobal("AbortController", MockAbortController);

    const saga = fetchTelemetryWorker();
    saga.next();
    expect(saga.return().value).toEqual(cancelled());
    saga.next(true);
    expect(abort).toHaveBeenCalledOnce();
  });
});
