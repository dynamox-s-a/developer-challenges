import type { TimeSeriesSummary } from "@dyn/contracts";
import { describe, expect, it, vi } from "vitest";
import { createAppStore } from "../../app/store";
import { createFakeApi } from "../../test/fakeApi";
import { deleteTimeSeries, fetchTimeSeries, uploadTimeSeries } from "./timeSeriesSlice";

const summary: TimeSeriesSummary = {
  id: "00000000-0000-4000-8000-000000000010",
  monitoringPointId: "00000000-0000-4000-8000-000000000020",
  sensorId: "sensor-1",
  label: "Baseline",
  sampleCount: 1,
  startedAt: "2026-08-24T12:00:00.000Z",
  endedAt: "2026-08-24T12:00:00.000Z",
  createdAt: "2026-08-24T12:00:01.000Z",
};

describe("timeSeriesSlice", () => {
  it("loads the paginated list through the injected API", async () => {
    const listTimeSeries = vi.fn(async () => ({
      items: [summary],
      page: 1,
      pageSize: 20,
      total: 1,
      totalPages: 1,
    }));
    const store = createAppStore(createFakeApi({ listTimeSeries }));

    await store.dispatch(
      fetchTimeSeries({
        page: 1,
        pageSize: 20,
        monitoringPointId: summary.monitoringPointId,
      })
    );

    expect(listTimeSeries).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      monitoringPointId: summary.monitoringPointId,
    });
    expect(store.getState().timeSeries).toMatchObject({
      status: "ready",
      result: { items: [summary], total: 1 },
    });
  });

  it("uploads validated samples to the selected monitoring point", async () => {
    const createTimeSeries = vi.fn(async () => summary);
    const store = createAppStore(createFakeApi({ createTimeSeries }));
    const samples = [{ timestamp: "2026-08-24T12:00:00.000Z", x: 1, y: 2, z: 3 }];

    await store.dispatch(
      uploadTimeSeries({
        monitoringPointId: summary.monitoringPointId,
        label: "Baseline",
        samples,
      })
    );

    expect(createTimeSeries).toHaveBeenCalledWith(summary.monitoringPointId, {
      label: "Baseline",
      samples,
    });
    expect(store.getState().timeSeries.mutationStatus).toBe("idle");
  });

  it("removes a deleted series from the active result", async () => {
    const deleteRequest = vi.fn(async () => undefined);
    const store = createAppStore(
      createFakeApi({
        listTimeSeries: async () => ({
          items: [summary],
          page: 1,
          pageSize: 20,
          total: 1,
          totalPages: 1,
        }),
        deleteTimeSeries: deleteRequest,
      })
    );
    await store.dispatch(fetchTimeSeries({ page: 1, pageSize: 20 }));

    await store.dispatch(deleteTimeSeries(summary.id));

    expect(deleteRequest).toHaveBeenCalledWith(summary.id);
    expect(store.getState().timeSeries).toMatchObject({
      result: { items: [], total: 0 },
    });
  });
});
