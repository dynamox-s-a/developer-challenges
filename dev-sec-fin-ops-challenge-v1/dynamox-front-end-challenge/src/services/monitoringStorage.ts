import type { MonitoringPoint } from '../features/monitoring/types'

const KEY = 'monitoring_points'

export const monitoringStorage = {
  read(): MonitoringPoint[] {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw) as MonitoringPoint[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  },

  write(items: MonitoringPoint[]) {
    localStorage.setItem(KEY, JSON.stringify(items))
  }
}
