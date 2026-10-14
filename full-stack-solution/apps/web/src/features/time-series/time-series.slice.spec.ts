import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore, type RootState } from "@web/app/store";
import { makeMetrics, makeReadings } from "@web/test/fixtures";
import {
  deleteReadings,
  fetchTimeSeries,
  ingestReadings,
  metricSelected,
  monitoringPointSelected,
  rangeChanged,
  selectReadingsByMetric,
} from "./time-series.slice";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const fetchMock = vi.fn();

const authenticated: Partial<RootState> = {
  auth: {
    token: "jwt-token",
    user: { id: "user-1", email: "user@example.com" },
    status: "authenticated",
    isSigningIn: false,
    error: null,
    expired: false,
  },
};

/** Answers each endpoint by URL, since the thunks fan out to several of them. */
function routeFetch(handlers: Record<string, unknown>) {
  fetchMock.mockImplementation((url: string) => {
    const match = Object.keys(handlers).find((key) => url.includes(key));
    return Promise.resolve(
      jsonResponse(match ? handlers[match] : { error: { message: url } }, match ? 200 : 404),
    );
  });
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

describe("selection", () => {
  it("drops the previous series when another point is selected", () => {
    const store = createStore({
      ...authenticated,
      timeSeries: {
        selectedMonitoringPointId: "point-1",
        range: {},
        readings: makeReadings(),
        selectedMetric: null,
        metrics: makeMetrics(),
        storedCount: 3,
        status: "succeeded",
        isMutating: false,
        error: null,
        lastIngest: null,
      },
    });

    store.dispatch(monitoringPointSelected("point-2"));

    expect(store.getState().timeSeries).toMatchObject({
      selectedMonitoringPointId: "point-2",
      readings: [],
      metrics: null,
      status: "idle",
    });
  });
});

describe("fetchTimeSeries", () => {
  it("loads readings and metrics for the selected point", async () => {
    const readings = makeReadings();
    const metrics = makeMetrics();
    routeFetch({ "/readings/metrics": metrics, "/readings": readings });
    const store = createStore(authenticated);
    store.dispatch(monitoringPointSelected("point-1"));

    await store.dispatch(fetchTimeSeries());

    expect(store.getState().timeSeries).toMatchObject({
      status: "succeeded",
      readings,
      metrics,
    });
  });

  it("forwards the range filter to the API", async () => {
    routeFetch({ "/readings/metrics": makeMetrics(), "/readings": [] });
    const store = createStore(authenticated);
    store.dispatch(monitoringPointSelected("point-1"));
    store.dispatch(
      rangeChanged({
        from: "2026-01-01T00:00:00.000Z",
        to: "2026-01-02T00:00:00.000Z",
      }),
    );

    await store.dispatch(fetchTimeSeries());

    const urls = fetchMock.mock.calls.map(([url]) => url as string);
    expect(urls.every((url) => url.includes("from=2026-01-01"))).toBe(true);
    expect(urls.every((url) => url.includes("to=2026-01-02"))).toBe(true);
  });

  it("refuses to load without a selected point", async () => {
    const store = createStore(authenticated);

    await store.dispatch(fetchTimeSeries());

    expect(fetchMock).not.toHaveBeenCalled();
    expect(store.getState().timeSeries.error).toMatchObject({
      code: "NO_SELECTION",
    });
  });
});

describe("ingestReadings", () => {
  it("keeps the ingest result so duplicates can be reported", async () => {
    routeFetch({
      "/readings/metrics": makeMetrics(),
      "/readings/count": { count: 10 },
      "/readings": { received: 3, inserted: 2 },
    });
    const store = createStore(authenticated);
    store.dispatch(monitoringPointSelected("point-1"));

    await store.dispatch(
      ingestReadings({
        monitoringPointId: "point-1",
        input: { readings: makeReadings() },
      }),
    );

    expect(store.getState().timeSeries.lastIngest).toEqual({
      received: 3,
      inserted: 2,
    });
    expect(store.getState().timeSeries.isMutating).toBe(false);
  });

  it("surfaces a rejected batch without clearing the chart", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { error: { code: "VALIDATION_ERROR", message: "Invalid request data" } },
        400,
      ),
    );
    const readings = makeReadings();
    const store = createStore({
      ...authenticated,
      timeSeries: {
        selectedMonitoringPointId: "point-1",
        range: {},
        readings,
        selectedMetric: null,
        metrics: makeMetrics(),
        storedCount: 3,
        status: "succeeded",
        isMutating: false,
        error: null,
        lastIngest: null,
      },
    });

    await store.dispatch(
      ingestReadings({ monitoringPointId: "point-1", input: { readings } }),
    );

    expect(store.getState().timeSeries.error).toMatchObject({ status: 400 });
    expect(store.getState().timeSeries.readings).toEqual(readings);
  });
});

describe("deleteReadings", () => {
  it("reloads the series after deleting", async () => {
    routeFetch({
      "/readings/metrics": makeMetrics({ count: 0, min: null, max: null, avg: null }),
      "/readings/count": { count: 0 },
      "/readings": { deleted: 3 },
    });
    const store = createStore(authenticated);
    store.dispatch(monitoringPointSelected("point-1"));

    const result = await store.dispatch(deleteReadings());

    expect(result.payload).toEqual({ deleted: 3 });
    expect(store.getState().timeSeries.storedCount).toBe(0);
  });
});

describe("quantities", () => {
  /** Readings of two quantities interleaved, as the API returns them. */
  const mixed = [
    { timestamp: "2026-01-01T00:00:00.000Z", value: 45, metric: "temperature" as const },
    { timestamp: "2026-01-01T00:00:00.000Z", value: 2.5, metric: "vibrationVelocityRms" as const },
    { timestamp: "2026-01-01T00:01:00.000Z", value: 46, metric: "temperature" as const },
  ];

  it("groups readings by quantity, in order of first appearance", () => {
    const store = createStore({
      ...authenticated,
      timeSeries: {
        selectedMonitoringPointId: "point-1",
        range: {},
        readings: mixed,
        selectedMetric: null,
        metrics: null,
        storedCount: null,
        status: "succeeded",
        isMutating: false,
        error: null,
        lastIngest: null,
      },
    });

    const groups = selectReadingsByMetric(store.getState());

    expect(groups.map((group) => group.metric)).toEqual([
      "temperature",
      "vibrationVelocityRms",
    ]);
    expect(groups[0].readings).toHaveLength(2);
    expect(groups[1].readings).toHaveLength(1);
  });

  it("aggregates the first quantity present when none was chosen", async () => {
    routeFetch({
      "/readings/metrics": makeMetrics(),
      "/readings": mixed,
    });
    const store = createStore(authenticated);
    store.dispatch(monitoringPointSelected("point-1"));

    await store.dispatch(fetchTimeSeries());

    const metricsUrl = fetchMock.mock.calls
      .map(([url]) => url as string)
      .find((url) => url.includes("/readings/metrics"));
    expect(metricsUrl).toContain("metric=temperature");
  });

  it("aggregates the chosen quantity", async () => {
    routeFetch({
      "/readings/metrics": makeMetrics({ metric: "vibrationVelocityRms" }),
      "/readings": mixed,
    });
    const store = createStore(authenticated);
    store.dispatch(monitoringPointSelected("point-1"));
    store.dispatch(metricSelected("vibrationVelocityRms"));

    await store.dispatch(fetchTimeSeries());

    const metricsUrl = fetchMock.mock.calls
      .map(([url]) => url as string)
      .find((url) => url.includes("/readings/metrics"));
    expect(metricsUrl).toContain("metric=vibrationVelocityRms");
  });

  it("falls back when the chosen quantity is absent from the range", async () => {
    routeFetch({
      "/readings/metrics": makeMetrics(),
      "/readings": [mixed[0]],
    });
    const store = createStore(authenticated);
    store.dispatch(monitoringPointSelected("point-1"));
    store.dispatch(metricSelected("vibrationAccelerationRms"));

    await store.dispatch(fetchTimeSeries());

    const metricsUrl = fetchMock.mock.calls
      .map(([url]) => url as string)
      .find((url) => url.includes("/readings/metrics"));
    // Asking the API to aggregate a quantity the range does not hold would
    // only return an empty aggregate labelled with the wrong quantity.
    expect(metricsUrl).toContain("metric=temperature");
  });

  it("asks for no aggregate when the range holds no readings", async () => {
    routeFetch({ "/readings": [] });
    const store = createStore(authenticated);
    store.dispatch(monitoringPointSelected("point-1"));

    await store.dispatch(fetchTimeSeries());

    expect(
      fetchMock.mock.calls.some(([url]) =>
        (url as string).includes("/readings/metrics"),
      ),
    ).toBe(false);
    expect(store.getState().timeSeries.metrics).toBeNull();
    expect(store.getState().timeSeries.status).toBe("succeeded");
  });

  it("forgets the chosen quantity when another point is selected", () => {
    const store = createStore(authenticated);
    store.dispatch(monitoringPointSelected("point-1"));
    store.dispatch(metricSelected("vibrationVelocityRms"));

    store.dispatch(monitoringPointSelected("point-2"));

    expect(store.getState().timeSeries.selectedMetric).toBeNull();
  });
});
