import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAppStore } from "../../app/store";
import { clearSession, readSession } from "../../auth/session";
import { createFakeApi } from "../../test/fakeApi";
import { fetchMachines } from "../machines/machinesSlice";
import { checkSession, login, logout, register, sessionExpired } from "./authSlice";

const session = {
  accessToken: "signed.jwt.token",
  tokenType: "Bearer" as const,
  expiresAt: "2099-08-24T12:00:00.000Z",
  user: { email: "admin@dynamox.local" },
};

describe("authSlice", () => {
  beforeEach(() => clearSession());

  it("stores the JWT session after a successful login", async () => {
    const store = createAppStore(createFakeApi({ login: async () => session }));

    await store.dispatch(login({ email: "admin@dynamox.local", password: "secret" }));

    expect(store.getState().auth.status).toBe("authenticated");
    expect(readSession()).toEqual(session);
  });

  it("signs a new account straight in after registration", async () => {
    const registerRequest = vi.fn(async () => session);
    const store = createAppStore(createFakeApi({ register: registerRequest }));

    await store.dispatch(register({ email: "new@dynamox.local", password: "long-enough" }));

    expect(registerRequest).toHaveBeenCalledWith({
      email: "new@dynamox.local",
      password: "long-enough",
    });
    expect(store.getState().auth.status).toBe("authenticated");
    expect(readSession()).toEqual(session);
  });

  it("surfaces a registration conflict without authenticating", async () => {
    const store = createAppStore(
      createFakeApi({
        register: async () => {
          throw new Error("An account with this email already exists");
        },
      })
    );

    await store.dispatch(register({ email: "new@dynamox.local", password: "long-enough" }));

    expect(store.getState().auth).toMatchObject({
      status: "anonymous",
      error: "An account with this email already exists",
    });
    expect(readSession()).toBeNull();
  });

  it("clears the local session on logout without a server round trip", () => {
    localStorage.setItem("dynamonitor.session", JSON.stringify(session));
    const store = createAppStore(createFakeApi());

    store.dispatch(logout());

    expect(readSession()).toBeNull();
    expect(store.getState().auth.status).toBe("anonymous");
  });

  it("clears a stored session when the session check fails", async () => {
    const store = createAppStore(
      createFakeApi({
        login: async () => session,
        getMe: async () => {
          throw new Error("Access token expired");
        },
      })
    );
    await store.dispatch(login({ email: "admin@dynamox.local", password: "secret" }));

    await store.dispatch(checkSession());

    expect(readSession()).toBeNull();
    expect(store.getState().auth).toMatchObject({ status: "anonymous", session: null });
  });

  it("clears private domain state when a 401 expires the session", async () => {
    const store = createAppStore(
      createFakeApi({
        login: async () => session,
        listMachines: async () => [
          {
            id: "00000000-0000-4000-8000-000000000001",
            name: "Private pump",
            type: "Pump",
            createdAt: "2026-08-24T12:00:00.000Z",
            updatedAt: "2026-08-24T12:00:00.000Z",
          },
        ],
      })
    );
    await store.dispatch(login({ email: "admin@dynamox.local", password: "secret" }));
    await store.dispatch(fetchMachines());

    store.dispatch(sessionExpired());

    expect(store.getState().auth.status).toBe("anonymous");
    expect(store.getState().machines).toMatchObject({ items: [], status: "idle" });
    expect(readSession()).toBeNull();
  });

  it("restores a valid stored session when the application reloads", async () => {
    localStorage.setItem("dynamonitor.session", JSON.stringify(session));
    vi.resetModules();
    const { authReducer: reloadedAuthReducer } = await import("./authSlice");
    const reloadedStore = configureStore({ reducer: reloadedAuthReducer });

    expect(reloadedStore.getState()).toMatchObject({ status: "checking", session });
  });
});
