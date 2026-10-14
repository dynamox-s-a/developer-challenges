import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore, type RootState } from "@web/app/store";
import { makeMonitoringPoint } from "@web/test/fixtures";
import {
  fetchMonitoringPoints,
  pageChanged,
  pageSizeChanged,
  sortChanged,
} from "./monitoring-points.slice";

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

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

describe("query reducers", () => {
  it("starts on page 1 with the required page size of 5", () => {
    expect(createStore().getState().monitoringPoints.query).toEqual({
      page: 1,
      pageSize: 5,
      sortBy: "machineName",
      order: "asc",
    });
  });

  it("translates the zero-based page from MUI into the 1-based API page", () => {
    const store = createStore();

    store.dispatch(pageChanged(2));

    expect(store.getState().monitoringPoints.query.page).toBe(3);
  });

  it("flips the direction when the active column is clicked again", () => {
    const store = createStore();

    store.dispatch(sortChanged("machineName"));
    expect(store.getState().monitoringPoints.query).toMatchObject({
      sortBy: "machineName",
      order: "desc",
    });

    store.dispatch(sortChanged("machineName"));
    expect(store.getState().monitoringPoints.query.order).toBe("asc");
  });

  it("starts ascending when a different column is selected", () => {
    const store = createStore();
    store.dispatch(sortChanged("machineName"));

    store.dispatch(sortChanged("sensorModel"));

    expect(store.getState().monitoringPoints.query).toMatchObject({
      sortBy: "sensorModel",
      order: "asc",
    });
  });

  it("returns to the first page when sorting or the page size changes", () => {
    const store = createStore();
    store.dispatch(pageChanged(4));

    store.dispatch(sortChanged("name"));
    expect(store.getState().monitoringPoints.query.page).toBe(1);

    store.dispatch(pageChanged(4));
    store.dispatch(pageSizeChanged(25));
    expect(store.getState().monitoringPoints.query).toMatchObject({
      page: 1,
      pageSize: 25,
    });
  });
});

describe("fetchMonitoringPoints", () => {
  it("sends the current query to the API and stores the page", async () => {
    const point = makeMonitoringPoint();
    fetchMock.mockResolvedValue(
      jsonResponse({ data: [point], page: 2, pageSize: 5, total: 7 }),
    );
    const store = createStore(authenticated);
    store.dispatch(pageChanged(1));
    store.dispatch(sortChanged("sensorModel"));

    await store.dispatch(fetchMonitoringPoints());

    expect(fetchMock.mock.calls[0][0]).toContain("sortBy=sensorModel");
    expect(store.getState().monitoringPoints).toMatchObject({
      status: "succeeded",
      items: [point],
      total: 7,
    });
  });

  it("adopts the page the server actually served", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ data: [], page: 1, pageSize: 5, total: 0 }),
    );
    const store = createStore(authenticated);
    store.dispatch(pageChanged(9));

    await store.dispatch(fetchMonitoringPoints());

    expect(store.getState().monitoringPoints.query.page).toBe(1);
  });
});
