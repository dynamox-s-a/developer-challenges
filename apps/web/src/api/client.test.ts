import { afterEach, describe, expect, it, vi } from "vitest";
import { createHttpApiClient } from "./client";

describe("createHttpApiClient", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("invalidates Redux auth after a private-route 401 even when storage already expired", async () => {
    const onUnauthorized = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              error: {
                code: "INVALID_TOKEN",
                message: "Access token expired",
                requestId: "request-1",
              },
            }),
            { status: 401, headers: { "Content-Type": "application/json" } }
          )
      )
    );
    const api = createHttpApiClient({
      getToken: () => null,
      onUnauthorized,
    });

    await expect(api.listMachines()).rejects.toThrow("Access token expired");
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });

  it("does not report invalid login credentials as an expired session", async () => {
    const onUnauthorized = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              error: {
                code: "INVALID_CREDENTIALS",
                message: "Email or password is incorrect",
                requestId: "request-2",
              },
            }),
            { status: 401, headers: { "Content-Type": "application/json" } }
          )
      )
    );
    const api = createHttpApiClient({
      getToken: () => null,
      onUnauthorized,
    });

    await expect(api.login({ email: "admin@dynamox.local", password: "wrong" })).rejects.toThrow(
      "Email or password is incorrect"
    );
    expect(onUnauthorized).not.toHaveBeenCalled();
  });
});
