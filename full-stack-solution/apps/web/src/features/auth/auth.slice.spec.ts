import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "@web/app/store";
import {
  loginErrorDismissed,
  restoreSession,
  sessionExpired,
  signIn,
  signOut,
} from "./auth.slice";
import { tokenStorage } from "./token-storage";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  tokenStorage.clear();
});

describe("signIn", () => {
  it("stores the token and the user on success", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        accessToken: "jwt-token",
        user: { id: "user-1", email: "user@example.com" },
      }),
    );
    const store = createStore();

    await store.dispatch(
      signIn({ email: "user@example.com", password: "secret123" }),
    );

    expect(store.getState().auth).toMatchObject({
      token: "jwt-token",
      user: { id: "user-1", email: "user@example.com" },
      status: "authenticated",
      isSigningIn: false,
      error: null,
    });
    expect(tokenStorage.read()).toBe("jwt-token");
  });

  it("keeps the user anonymous and exposes the error on failure", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { error: { code: "UNAUTHORIZED", message: "Invalid credentials" } },
        401,
      ),
    );
    const store = createStore();

    await store.dispatch(
      signIn({ email: "user@example.com", password: "wrong" }),
    );

    const { auth } = store.getState();
    expect(auth.status).toBe("anonymous");
    expect(auth.token).toBeNull();
    expect(auth.error).toMatchObject({ status: 401, message: "Invalid credentials" });
    expect(tokenStorage.read()).toBeNull();
  });

  it("clears a previous error when a new attempt starts", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: { code: "UNAUTHORIZED", message: "bad" } }, 401),
    );
    const store = createStore();
    await store.dispatch(signIn({ email: "a@b.com", password: "x" }));
    expect(store.getState().auth.error).not.toBeNull();

    store.dispatch(loginErrorDismissed());

    expect(store.getState().auth.error).toBeNull();
  });
});

describe("restoreSession", () => {
  it("confirms a valid stored token", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ id: "user-1", email: "user@example.com" }),
    );
    const store = createStore({
      auth: {
        token: "stored-token",
        user: null,
        status: "unknown",
        isSigningIn: false,
        error: null,
        expired: false,
      },
    });

    await store.dispatch(restoreSession());

    expect(store.getState().auth).toMatchObject({
      status: "authenticated",
      user: { id: "user-1" },
    });
  });

  it("drops a token the server rejects", async () => {
    tokenStorage.write("stale-token");
    fetchMock.mockResolvedValue(
      jsonResponse({ error: { code: "UNAUTHORIZED", message: "expired" } }, 401),
    );
    const store = createStore({
      auth: {
        token: "stale-token",
        user: null,
        status: "unknown",
        isSigningIn: false,
        error: null,
        expired: false,
      },
    });

    await store.dispatch(restoreSession());

    expect(store.getState().auth.status).toBe("anonymous");
    expect(store.getState().auth.token).toBeNull();
    expect(tokenStorage.read()).toBeNull();
  });

  it("rejects without calling the API when there is no token", async () => {
    const store = createStore();

    await store.dispatch(restoreSession());

    expect(fetchMock).not.toHaveBeenCalled();
    expect(store.getState().auth.status).toBe("anonymous");
  });
});

describe("signOut", () => {
  it("clears the session even if the server call fails", async () => {
    tokenStorage.write("jwt-token");
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    const store = createStore({
      auth: {
        token: "jwt-token",
        user: { id: "user-1", email: "user@example.com" },
        status: "authenticated",
        isSigningIn: false,
        error: null,
        expired: false,
      },
    });

    await store.dispatch(signOut());

    expect(store.getState().auth).toMatchObject({
      token: null,
      user: null,
      status: "anonymous",
      expired: false,
    });
    expect(tokenStorage.read()).toBeNull();
  });
});

describe("sessionExpired", () => {
  it("marks the session as expired so the login page can explain why", () => {
    tokenStorage.write("jwt-token");
    const store = createStore({
      auth: {
        token: "jwt-token",
        user: { id: "user-1", email: "user@example.com" },
        status: "authenticated",
        isSigningIn: false,
        error: null,
        expired: false,
      },
    });

    store.dispatch(sessionExpired());

    expect(store.getState().auth).toMatchObject({
      token: null,
      status: "anonymous",
      expired: true,
    });
    expect(tokenStorage.read()).toBeNull();
  });
});
