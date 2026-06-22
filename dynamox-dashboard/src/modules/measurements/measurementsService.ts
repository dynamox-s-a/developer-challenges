import type { IMeasurementSeries } from './types'

const API_BASE_URL = import.meta.env.VITE_API_URL

export async function fetchMeasurements(): Promise<IMeasurementSeries[]> {
  const response = await fetch(`${API_BASE_URL}/measurements`)

  if (!response.ok) {
    throw new Error('Unable to fetch measurements')
  }

  return response.json() as Promise<IMeasurementSeries[]>
}
