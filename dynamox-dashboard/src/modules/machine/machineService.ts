import type { IMachineInfo } from './types'

const API_BASE_URL = import.meta.env.VITE_API_URL

export async function fetchMachine(): Promise<IMachineInfo> {
  const response = await fetch(`${API_BASE_URL}/machine`)

  if (!response.ok) {
    throw new Error('Unable to fetch machine data')
  }

  return response.json() as Promise<IMachineInfo>
}
