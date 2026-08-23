import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchTelemetry } from "../api/telemetryApi";

describe("fetchTelemetry", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("emite o sinal de cancelamento para a requisição da API", async () => {
    const signal = new AbortController().signal;
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    vi.stubGlobal("fetch", fetchMock);

    await fetchTelemetry(signal);

    expect(fetchMock).toHaveBeenCalledWith("/data", { signal });
  });
});
