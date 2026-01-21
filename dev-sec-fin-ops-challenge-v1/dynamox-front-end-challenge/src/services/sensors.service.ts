import { api } from './api'
import type { SensorModel } from '../features/monitoring/types'

export type SensorRecord = {
  id: string
  model: SensorModel
  monitoringPointId: string
  machineId: string
  createdAt?: string
}

export const sensorsService = {
  list: () => api.get<SensorRecord[]>('/sensors'),
  upsert: (sensor: SensorRecord) => api.put<SensorRecord>(`/sensors/${sensor.id}`, sensor),
  remove: (id: string) => api.del(`/sensors/${id}`)
}
