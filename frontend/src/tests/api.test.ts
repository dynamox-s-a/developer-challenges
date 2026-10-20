import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchMachine, fetchSeries } from "../features/data/api";
import { machineFixture, seriesDtoFixture } from "./features/data/fixtures";

const BASE_URL = "http://api.test";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

describe("api", () => {
  let fetchMock: ReturnType<typeof vi.fn<typeof fetch>>;

  beforeEach(() => {
    fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("VITE_API_URL", BASE_URL);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("fetchMachine requests /machine and returns the JSON", async () => {
    fetchMock.mockImplementation(async () => jsonResponse(machineFixture));

    await expect(fetchMachine()).resolves.toEqual(machineFixture);
    expect(fetchMock.mock.calls[0][0]).toBe(`${BASE_URL}/machine`);
  });

  it("fetchSeries requests /series and returns the JSON", async () => {
    fetchMock.mockImplementation(async () => jsonResponse(seriesDtoFixture));

    await expect(fetchSeries()).resolves.toEqual(seriesDtoFixture);
    expect(fetchMock.mock.calls[0][0]).toBe(`${BASE_URL}/series`);
  });

  it("throws on a non-ok response", async () => {
    fetchMock.mockImplementation(async () => jsonResponse({}, 500));

    await expect(fetchSeries()).rejects.toThrow("Request failed: 500 /series");
  });

  it("throws on 404 with the path in the message", async () => {
    fetchMock.mockImplementation(async () => jsonResponse({}, 404));

    await expect(fetchMachine()).rejects.toThrow(
      "Request failed: 404 /machine",
    );
  });

  it("propagates network failures", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(fetchSeries()).rejects.toThrow("Failed to fetch");
  });

  it("fails fast with a clear message when VITE_API_URL is not set", async () => {
    vi.stubEnv("VITE_API_URL", "");

    await expect(fetchMachine()).rejects.toThrow(/VITE_API_URL/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
