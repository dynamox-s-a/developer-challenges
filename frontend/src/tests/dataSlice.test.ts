import { describe, expect, it } from "vitest";
import {
  dataReducer,
  fetchDataFailed,
  fetchDataRequested,
  fetchDataSucceeded,
  selectCharts,
  selectDataError,
  selectDataStatus,
  selectMachine,
} from "../features/data/dataSlice";
import { chartsFixture, machineFixture } from "./features/data/fixtures";
import { setupStore } from "../app/store";

const loaded = dataReducer(
  undefined,
  fetchDataSucceeded({ machine: machineFixture, charts: chartsFixture }),
);

describe("dataSlice", () => {
  it("starts idle and empty", () => {
    expect(dataReducer(undefined, { type: "@@init" })).toEqual({
      status: "idle",
      error: null,
      machine: null,
      charts: null,
    });
  });

  it("requested sets loading and clears error", () => {
    const failed = dataReducer(undefined, fetchDataFailed("x"));
    const next = dataReducer(failed, fetchDataRequested());
    expect(next.status).toBe("loading");
    expect(next.error).toBeNull();
  });

  it("succeeded stores machine and charts", () => {
    expect(loaded.status).toBe("succeeded");
    expect(loaded.machine).toEqual(machineFixture);
    expect(loaded.charts).toEqual(chartsFixture);
  });

  it("failed sets error", () => {
    const next = dataReducer(undefined, fetchDataFailed("boom"));
    expect(next.status).toBe("failed");
    expect(next.error).toBe("boom");
  });

  it("keeps stale data while refetching", () => {
    expect(dataReducer(loaded, fetchDataRequested()).charts).toEqual(
      chartsFixture,
    );
  });

  it("keeps stale data on failure", () => {
    expect(dataReducer(loaded, fetchDataFailed("x")).charts).toEqual(
      chartsFixture,
    );
  });
});

describe("selectors", () => {
  const state = setupStore({ data: loaded }).getState();

  it("read each field", () => {
    expect(selectDataStatus(state)).toBe("succeeded");
    expect(selectDataError(state)).toBeNull();
    expect(selectMachine(state)).toEqual(machineFixture);
  });

  it("return stored references, no new objects", () => {
    expect(selectCharts(state)).toBe(loaded.charts);
  });
});
