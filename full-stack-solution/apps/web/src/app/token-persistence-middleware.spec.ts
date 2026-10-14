import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "@web/app/store";
import { sessionExpired, signIn, signOut } from "@web/features/auth/auth.slice";
import { tokenStorage } from "@web/features/auth/token-storage";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const fetchMock = vi.fn();

const signedIn = {
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
  tokenStorage.clear();
});

describe("tokenPersistenceMiddleware", () => {
  it("writes the token when a session starts", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        accessToken: "fresh-token",
        user: { id: "user-1", email: "user@example.com" },
      }),
    );
    const store = createStore();

    await store.dispatch(signIn({ email: "a@b.com", password: "secret123" }));

    expect(tokenStorage.read()).toBe("fresh-token");
  });

  it("clears the token on sign out", async () => {
    tokenStorage.write("jwt-token");
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    const store = createStore(signedIn);

    await store.dispatch(signOut());

    expect(tokenStorage.read()).toBeNull();
  });

  it("clears the token when the session expires", () => {
    tokenStorage.write("jwt-token");
    const store = createStore(signedIn);

    store.dispatch(sessionExpired());

    expect(tokenStorage.read()).toBeNull();
  });

  it("leaves storage alone for actions that do not touch the token", () => {
    tokenStorage.write("jwt-token");
    const store = createStore(signedIn);

    store.dispatch({ type: "notifications/notify", payload: { id: "1", message: "hi", severity: "info" } });

    expect(tokenStorage.read()).toBe("jwt-token");
  });
});
