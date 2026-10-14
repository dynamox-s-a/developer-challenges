import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "@web/app/store";
import { signIn } from "@web/features/auth/auth.slice";
import { fetchMachines } from "@web/features/machines/machines.slice";

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const fetchMock = vi.fn();

const authenticatedState = {
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

describe("authMiddleware", () => {
  it("ends the session when a request is rejected with 401", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: { code: "UNAUTHORIZED", message: "expired" } }, 401),
    );
    const store = createStore(authenticatedState);

    await store.dispatch(fetchMachines());

    expect(store.getState().auth).toMatchObject({
      token: null,
      status: "anonymous",
      expired: true,
    });
  });

  it("keeps the session for other failures", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: { code: "NOT_FOUND", message: "nope" } }, 404),
    );
    const store = createStore(authenticatedState);

    await store.dispatch(fetchMachines());

    expect(store.getState().auth.status).toBe("authenticated");
  });

  it("does not treat a failed login as an expired session", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { error: { code: "UNAUTHORIZED", message: "Invalid credentials" } },
        401,
      ),
    );
    const store = createStore();

    await store.dispatch(signIn({ email: "a@b.com", password: "wrong" }));

    expect(store.getState().auth.expired).toBe(false);
    expect(store.getState().auth.error).toMatchObject({ status: 401 });
  });
});
