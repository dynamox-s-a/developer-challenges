import { fetchAllMetrics } from "../api";
import type { Series } from "../types";

const originalFetch = globalThis.fetch;

function makeResponse<T>(ok: boolean, body?: T): Response {
  return {
    ok,
    json: async () => body as unknown,
  } as Response;
}

afterEach(() => {
  globalThis.fetch = originalFetch!;
});

it("converte séries válidas e agrupa por métricas (acc/vel/tmp)", async () => {
  const seriesByIndex: Record<number, Series> = {
    0: {
      name: "accelerationRMS/x",
      data: [{ datetime: "2025-01-01T00:00:00Z", max: 42 }],
    },
    1: {
      name: "velocityRMS/y",
      data: [{ datetime: "2025-01-01T00:00:00Z", max: 7.5 }],
    },
    2: {
      name: "temperature",
      data: [{ datetime: "2025-01-01T00:00:00Z", max: 33 }],
    },
  };

  globalThis.fetch = (async (url: RequestInfo | URL): Promise<Response> => {
    const idx = parseInt(String(url).split("/").pop() || "", 10);
    const s = seriesByIndex[idx];
    return s ? makeResponse(true, s) : makeResponse(false);
  }) as typeof fetch;

  const result = await fetchAllMetrics();

  expect(result.acceleration).toHaveLength(1);
  expect(result.velocity).toHaveLength(1);
  expect(result.temperature).toHaveLength(1);

  expect(result.acceleration[0].points[0][1]).toBe(42);
  expect(result.velocity[0].points[0][1]).toBe(7.5);
  expect(result.temperature[0].points[0][1]).toBe(33);
  expect(typeof result.acceleration[0].points[0][0]).toBe("number");
});

it("ignora respostas inválidas (sem nome/dados) e índices inexistentes", async () => {
  globalThis.fetch = (async (url: RequestInfo | URL): Promise<Response> => {
    const idx = parseInt(String(url).split("/").pop() || "", 10);
    if (idx === 0) {
      return makeResponse(true, { name: "", data: [] });
    }
    if (idx === 1) {
      const valid: Series = {
        name: "acceleration",
        data: [{ datetime: "2025-01-01T00:00:00Z", max: 1 }],
      };
      return makeResponse(true, valid);
    }
    return makeResponse(false);
  }) as typeof fetch;

  const result = await fetchAllMetrics();

  expect(result.acceleration).toHaveLength(1);
  expect(result.velocity).toHaveLength(0);
  expect(result.temperature).toHaveLength(0);
});
