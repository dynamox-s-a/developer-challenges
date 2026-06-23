import type { IMeasurementSeries } from './types'

const API_BASE_URL = import.meta.env.VITE_API_URL

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error('Unable to fetch measurements')
  }

  return response.json() as Promise<T>
}

export async function fetchMeasurements(): Promise<IMeasurementSeries[]> {
  return request<IMeasurementSeries[]>('/measurements')
}
