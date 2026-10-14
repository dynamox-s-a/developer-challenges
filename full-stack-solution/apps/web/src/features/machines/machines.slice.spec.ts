import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "@web/app/store";
import { makeMachine } from "@web/test/fixtures";
import {
  createMachine,
  deleteMachine,
  fetchMachines,
  selectMachinesBelowMinimumPoints,
  updateMachine,
} from "./machines.slice";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const fetchMock = vi.fn();

const authenticated = {
  auth: {
    token: "jwt-token",
    user: { id: "user-1", email: "user@example.com" },
    status: "authenticated" as const,
    isSigningIn: false,
    error: null,
    expired: false,
  },
};

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

describe("machines slice", () => {
  it("loads the machine list", async () => {
    const machines = [makeMachine(), makeMachine({ id: "machine-2", name: "Fan B", type: "Fan" })];
    fetchMock.mockResolvedValue(jsonResponse(machines));
    const store = createStore(authenticated);

    await store.dispatch(fetchMachines());

    expect(store.getState().machines).toMatchObject({
      status: "succeeded",
      items: machines,
      error: null,
    });
  });

  it("records the failure when the list cannot be loaded", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: { code: "INTERNAL_ERROR", message: "boom" } }, 500),
    );
    const store = createStore(authenticated);

    await store.dispatch(fetchMachines());

    expect(store.getState().machines.status).toBe("failed");
    expect(store.getState().machines.error).toMatchObject({ message: "boom" });
  });

  it("appends a created machine", async () => {
    const created = makeMachine({ id: "machine-3", name: "Fan C", type: "Fan", monitoringPointsCount: 0 });
    fetchMock.mockResolvedValue(jsonResponse(created, 201));
    const store = createStore({ ...authenticated });

    await store.dispatch(createMachine({ name: "Fan C", type: "Fan" }));

    expect(store.getState().machines.items).toEqual([created]);
    expect(store.getState().machines.isMutating).toBe(false);
  });

  it("replaces the updated machine in place", async () => {
    const existing = makeMachine();
    const updated = { ...existing, name: "Pump A2", type: "Fan" as const };
    fetchMock.mockResolvedValue(jsonResponse(updated));
    const store = createStore({
      ...authenticated,
      machines: { items: [existing], status: "succeeded", isMutating: false, error: null },
    });

    await store.dispatch(
      updateMachine({ id: existing.id, changes: { name: "Pump A2", type: "Fan" } }),
    );

    expect(store.getState().machines.items).toEqual([updated]);
  });

  it("keeps the list untouched when an update is refused", async () => {
    const existing = makeMachine({ type: "Fan" });
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          error: {
            code: "CONFLICT",
            message: "TcAg sensors are installed on this machine",
          },
        },
        409,
      ),
    );
    const store = createStore({
      ...authenticated,
      machines: { items: [existing], status: "succeeded", isMutating: false, error: null },
    });

    await store.dispatch(
      updateMachine({ id: existing.id, changes: { type: "Pump" } }),
    );

    expect(store.getState().machines.items).toEqual([existing]);
    expect(store.getState().machines.error).toMatchObject({ status: 409 });
    expect(store.getState().machines.isMutating).toBe(false);
  });

  it("removes a deleted machine", async () => {
    const existing = makeMachine();
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    const store = createStore({
      ...authenticated,
      machines: { items: [existing], status: "succeeded", isMutating: false, error: null },
    });

    await store.dispatch(deleteMachine(existing.id));

    expect(store.getState().machines.items).toEqual([]);
  });

  it("fails without calling the API when there is no session", async () => {
    const store = createStore();

    await store.dispatch(fetchMachines());

    expect(fetchMock).not.toHaveBeenCalled();
    expect(store.getState().machines.error).toMatchObject({ status: 401 });
  });
});

describe("selectMachinesBelowMinimumPoints", () => {
  it("lists only the machines under the recommended minimum of 2 points", () => {
    const store = createStore({
      machines: {
        items: [
          makeMachine({ id: "a", monitoringPointsCount: 0 }),
          makeMachine({ id: "b", monitoringPointsCount: 1 }),
          makeMachine({ id: "c", monitoringPointsCount: 2 }),
          makeMachine({ id: "d", monitoringPointsCount: 5 }),
        ],
        status: "succeeded",
        isMutating: false,
        error: null,
      },
    });

    const result = selectMachinesBelowMinimumPoints(store.getState());

    expect(result.map((machine) => machine.id)).toEqual(["a", "b"]);
  });
});
