import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "./api-error";
import { request } from "./http-client";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("request", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("sends the bearer token and parses the JSON body", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: "1" }));

    const result = await request<{ id: string }>("/api/machines", {
      token: "token-123",
    });

    expect(result).toEqual({ id: "1" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/machines");
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer token-123",
    );
    expect(init.body).toBeUndefined();
  });

  it("omits the Authorization header when there is no token", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));

    await request("/api/auth/login", { method: "POST", body: { email: "a" } });

    const [, init] = fetchMock.mock.calls[0];
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined();
    expect(init.body).toBe(JSON.stringify({ email: "a" }));
  });

  it("builds the query string and drops empty values", async () => {
    fetchMock.mockResolvedValue(jsonResponse([]));

    await request("/api/monitoring-points", {
      query: { page: 2, pageSize: 5, from: undefined, to: null },
    });

    expect(fetchMock.mock.calls[0][0]).toBe(
      "/api/monitoring-points?page=2&pageSize=5",
    );
  });

  it("resolves with undefined for 204 responses", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(request("/api/machines/1", { method: "DELETE" })).resolves.toBeUndefined();
  });

  it("converts an API error body into an ApiError", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          error: {
            code: "BUSINESS_RULE_VIOLATION",
            message: "Sensor model TcAg cannot be used on Pump machines",
            details: [{ path: "model", message: "not allowed" }],
          },
        },
        422,
      ),
    );

    const error = await request("/api/monitoring-points/1/sensor", {
      method: "PUT",
    }).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 422,
      code: "BUSINESS_RULE_VIOLATION",
      message: "Sensor model TcAg cannot be used on Pump machines",
      details: [{ path: "model", message: "not allowed" }],
    });
  });

  it("falls back to a generic message when the error body is not JSON", async () => {
    fetchMock.mockResolvedValue(new Response("<html>502</html>", { status: 502 }));

    const error = (await request("/api/health").catch(
      (caught: unknown) => caught,
    )) as ApiError;

    expect(error.code).toBe("HTTP_ERROR");
    expect(error.message).toBe("Request failed with status 502");
  });

  it("reports a network failure as a NETWORK_ERROR", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    const error = (await request("/api/health").catch(
      (caught: unknown) => caught,
    )) as ApiError;

    expect(error.status).toBe(0);
    expect(error.code).toBe("NETWORK_ERROR");
  });

  it("flags 401 responses as unauthorized", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: { code: "UNAUTHORIZED", message: "nope" } }, 401),
    );

    const error = (await request("/api/auth/me").catch(
      (caught: unknown) => caught,
    )) as ApiError;

    expect(error.isUnauthorized).toBe(true);
  });
});
