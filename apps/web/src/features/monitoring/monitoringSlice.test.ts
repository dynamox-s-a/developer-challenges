import type { Machine, MonitoringPoint, MonitoringPointListItem } from "@dyn/contracts";
import { describe, expect, it, vi } from "vitest";
import { createAppStore } from "../../app/store";
import { createFakeApi } from "../../test/fakeApi";
import { deleteMachine, updateMachine } from "../machines/machinesSlice";
import {
  createMonitoringPoint,
  fetchMachinePoints,
  fetchMonitoringPointDirectory,
  fetchMonitoringPoints,
} from "./monitoringSlice";

function deferred<T>() {
  let resolve: (value: T) => void = () => {
    throw new Error("Deferred promise was not initialized.");
  };
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

function point(id: string, machineId: string, name: string): MonitoringPoint {
  return {
    id,
    machineId,
    name,
    sensor: null,
    createdAt: "2026-08-24T12:00:00.000Z",
    updatedAt: "2026-08-24T12:00:00.000Z",
  };
}

function listItem(id: string, machineId: string, machineName: string): MonitoringPointListItem {
  return {
    id,
    machineId,
    machineName,
    machineType: "Pump",
    monitoringPointName: `Point of ${machineName}`,
    sensorId: null,
    sensorModel: null,
    createdAt: "2026-08-24T12:00:00.000Z",
  };
}

function machine(id: string, name: string, type: Machine["type"]): Machine {
  return {
    id,
    name,
    type,
    createdAt: "2026-08-24T12:00:00.000Z",
    updatedAt: "2026-08-24T12:00:00.000Z",
  };
}

describe("monitoringSlice", () => {
  it("ignores a stale point response after the selected machine changes", async () => {
    const machineA = "00000000-0000-4000-8000-000000000001";
    const machineB = "00000000-0000-4000-8000-000000000002";
    const pointsA = deferred<MonitoringPoint[]>();
    const pointsB = deferred<MonitoringPoint[]>();
    const store = createAppStore(
      createFakeApi({
        listMachineMonitoringPoints: async (machineId) =>
          machineId === machineA ? pointsA.promise : pointsB.promise,
      })
    );

    const requestA = store.dispatch(fetchMachinePoints(machineA));
    const requestB = store.dispatch(fetchMachinePoints(machineB));
    pointsB.resolve([point("00000000-0000-4000-8000-000000000012", machineB, "Fan B")]);
    await requestB;
    pointsA.resolve([point("00000000-0000-4000-8000-000000000011", machineA, "Pump A")]);
    await requestA;

    expect(store.getState().monitoring.machinePoints).toEqual([
      point("00000000-0000-4000-8000-000000000012", machineB, "Fan B"),
    ]);
  });

  it("builds the point directory from every machine in a single fan-out", async () => {
    const machineA = "00000000-0000-4000-8000-000000000001";
    const machineB = "00000000-0000-4000-8000-000000000002";
    const pumpA = point("00000000-0000-4000-8000-000000000011", machineA, "Pump A");
    const fanB = point("00000000-0000-4000-8000-000000000012", machineB, "Fan B");
    const listMachineMonitoringPoints = vi.fn(async (machineId: string) =>
      machineId === machineA ? [pumpA] : [fanB]
    );
    const store = createAppStore(createFakeApi({ listMachineMonitoringPoints }));

    await store.dispatch(fetchMonitoringPointDirectory([machineA, machineB]));

    expect(listMachineMonitoringPoints).toHaveBeenCalledTimes(2);
    expect(store.getState().monitoring).toMatchObject({
      directoryStatus: "ready",
      directory: [pumpA, fanB],
    });
  });

  it("reports a directory failure without touching the point list error", async () => {
    const store = createAppStore(
      createFakeApi({
        listMachineMonitoringPoints: async () => {
          throw new Error("Monitoring points are unavailable.");
        },
      })
    );

    await store.dispatch(fetchMonitoringPointDirectory(["00000000-0000-4000-8000-000000000001"]));

    expect(store.getState().monitoring).toMatchObject({
      directoryStatus: "failed",
      directoryError: "Monitoring points are unavailable.",
      error: null,
    });
  });

  it("drops the deleted machine from the paginated list and the directory", async () => {
    const machineA = "00000000-0000-4000-8000-000000000001";
    const machineB = "00000000-0000-4000-8000-000000000002";
    const rowA = listItem("00000000-0000-4000-8000-000000000011", machineA, "Pump A");
    const rowB = listItem("00000000-0000-4000-8000-000000000012", machineB, "Fan B");
    const pointA = point("00000000-0000-4000-8000-000000000011", machineA, "Pump A point");
    const pointB = point("00000000-0000-4000-8000-000000000012", machineB, "Fan B point");
    const store = createAppStore(
      createFakeApi({
        listMonitoringPoints: async (query) => ({
          items: [rowA, rowB],
          page: query.page,
          pageSize: 5,
          total: 2,
          totalPages: 1,
          sortBy: query.sortBy,
          sortOrder: query.sortOrder,
        }),
        listMachineMonitoringPoints: async (machineId) =>
          machineId === machineA ? [pointA] : [pointB],
      })
    );
    await store.dispatch(
      fetchMonitoringPoints({ page: 1, sortBy: "monitoringPointName", sortOrder: "asc" })
    );
    await store.dispatch(fetchMonitoringPointDirectory([machineA, machineB]));
    await store.dispatch(fetchMachinePoints(machineA));

    await store.dispatch(deleteMachine(machineA));

    const monitoring = store.getState().monitoring;
    expect(monitoring.result?.items).toEqual([rowB]);
    expect(monitoring.result?.total).toBe(1);
    expect(monitoring.directory).toEqual([pointB]);
    expect(monitoring.machinePoints).toEqual([]);
    expect(monitoring.machinePointsMachineId).toBeNull();
  });

  it("writes a changed machine type through to the list rows", async () => {
    const machineA = "00000000-0000-4000-8000-000000000001";
    const renamed = machine(machineA, "Renamed fan", "Fan");
    const store = createAppStore(
      createFakeApi({
        listMonitoringPoints: async (query) => ({
          items: [listItem("00000000-0000-4000-8000-000000000011", machineA, "Pump A")],
          page: query.page,
          pageSize: 5,
          total: 1,
          totalPages: 1,
          sortBy: query.sortBy,
          sortOrder: query.sortOrder,
        }),
        updateMachine: async () => renamed,
      })
    );
    await store.dispatch(
      fetchMonitoringPoints({ page: 1, sortBy: "monitoringPointName", sortOrder: "asc" })
    );

    await store.dispatch(updateMachine({ id: machineA, name: "Renamed fan", type: "Fan" }));

    expect(store.getState().monitoring.result?.items[0]).toMatchObject({
      machineName: "Renamed fan",
      machineType: "Fan",
    });
  });

  it("appends the first monitoring point of a machine to its loaded empty list", async () => {
    const machineA = "00000000-0000-4000-8000-000000000001";
    const created = point("00000000-0000-4000-8000-000000000011", machineA, "Drive-end bearing");
    const store = createAppStore(
      createFakeApi({
        listMachineMonitoringPoints: async () => [],
        createMonitoringPoint: async () => created,
      })
    );
    await store.dispatch(fetchMachinePoints(machineA));

    await store.dispatch(createMonitoringPoint({ machineId: machineA, name: "Drive-end bearing" }));

    expect(store.getState().monitoring.machinePoints).toEqual([created]);
  });

  it("keeps a point created for another machine out of the loaded list", async () => {
    const machineA = "00000000-0000-4000-8000-000000000001";
    const machineB = "00000000-0000-4000-8000-000000000002";
    const existing = point("00000000-0000-4000-8000-000000000011", machineA, "Pump A point");
    const created = point("00000000-0000-4000-8000-000000000012", machineB, "Fan B point");
    const store = createAppStore(
      createFakeApi({
        listMachineMonitoringPoints: async () => [existing],
        createMonitoringPoint: async () => created,
      })
    );
    await store.dispatch(fetchMachinePoints(machineA));

    await store.dispatch(createMonitoringPoint({ machineId: machineB, name: "Fan B point" }));

    expect(store.getState().monitoring.machinePoints).toEqual([existing]);
  });
});
