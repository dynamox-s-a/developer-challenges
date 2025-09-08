import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import reducer from "../reducer";
import dataSaga from "../saga";
import { dataFetchRequested } from "../actions";
import type { Series } from "../types";

const originalFetch = globalThis.fetch;

function makeResponse<T>(ok: boolean, body?: T): Response {
  return {
    ok,
    json: async () => body as unknown,
  } as Response;
}

afterEach(() => {
  globalThis.fetch = originalFetch!;
});

function createTestStore() {
  const saga = createSagaMiddleware();
  const store = configureStore({
    reducer: { data: reducer },
    middleware: (gdm) => gdm({ thunk: false }).concat(saga),
  });
  saga.run(dataSaga);
  return store;
}

function waitFor(cond: () => boolean, timeoutMs = 1000): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function loop() {
      if (cond()) return resolve();
      if (Date.now() - start > timeoutMs) return reject(new Error("timeout"));
      setTimeout(loop, 10);
    })();
  });
}

it("dispara sucesso e popula as séries quando a API responde OK", async () => {
  const seriesByIndex: Record<number, Series> = {
    0: { name: "accelerationRMS/x", data: [{ datetime: "2025-01-01T00:00:00Z", max: 1 }] },
    1: { name: "velocityRMS/y",     data: [{ datetime: "2025-01-01T00:00:00Z", max: 2 }] },
    2: { name: "temperature",       data: [{ datetime: "2025-01-01T00:00:00Z", max: 3 }] },
  };

  globalThis.fetch = (async (url: RequestInfo | URL): Promise<Response> => {
    const idx = parseInt(String(url).split("/").pop() || "", 10);
    const s = seriesByIndex[idx];
    return s ? makeResponse(true, s) : makeResponse(false);
  }) as typeof fetch;

  const store = createTestStore();
  store.dispatch(dataFetchRequested());

  await waitFor(() => store.getState().data.loading === false);

  const { acceleration, velocity, temperature, error } = store.getState().data;
  expect(error).toBeNull();
  expect(acceleration.length).toBe(1);
  expect(velocity.length).toBe(1);
  expect(temperature.length).toBe(1);
});

it("dispara falha quando a API lança erro", async () => {
  globalThis.fetch = (async (): Promise<Response> => {
    throw new Error("boom");
  }) as typeof fetch;

  const store = createTestStore();
  store.dispatch(dataFetchRequested());

  await waitFor(() => store.getState().data.loading === false);

  const { error, acceleration, velocity, temperature } = store.getState().data;
  expect(typeof error).toBe("string");
  expect(acceleration.length).toBe(0);
  expect(velocity.length).toBe(0);
  expect(temperature.length).toBe(0);
});
