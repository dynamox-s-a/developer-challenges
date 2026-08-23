import type { TelemetryResponse } from "../model/types";
export async function fetchTelemetry(
  signal?: AbortSignal,
): Promise<TelemetryResponse> {
  const response = await fetch("/data", { signal });
  if (!response.ok)
    throw new Error(
      `Não foi possível carregar os dados (HTTP ${response.status}).`,
    );
  const payload: unknown = await response.json();
  if (!Array.isArray(payload))
    throw new Error("A API retornou um formato de dados inválido.");
  return payload as TelemetryResponse;
}
