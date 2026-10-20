import type { MachineDto, SeriesDto } from "./types";

async function getJson<T>(path: string): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_URL;
  if (!baseUrl)
    throw new Error("VITE_API_URL is not set. Copy .env.example to .env.");
  const res = await fetch(`${baseUrl}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${path}`);
  return res.json() as Promise<T>;
}

export const fetchMachine = () => getJson<MachineDto>("/machine");
export const fetchSeries = () => getJson<SeriesDto[]>("/series");
