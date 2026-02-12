import { useCallback, useState } from 'react'
import {
  type TimeSeriesPaginatedResponse,
  TimeSeriesPaginatedResponseWrapperSchema,
} from '@/types/zod/timeSeries'

export const useGetTimeSeriesByMonitoringPoint = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTimeSeries = useCallback(
    async (
      monitoringPointId: string,
      page = 0,
      pageSize = 50,
    ): Promise<{
      success: boolean
      data?: TimeSeriesPaginatedResponse
      message?: string
    }> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `/api/time-series/${monitoringPointId}?page=${page}&pageSize=${pageSize}`,
        )
        const resp = await response.json()
        const parsed = TimeSeriesPaginatedResponseWrapperSchema.parse(resp)

        if (!parsed.success) {
          setError(parsed.message)
          return { success: false, message: parsed.message }
        }

        return { success: true, data: parsed.data }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro desconhecido'
        setError(msg)
        return { success: false, message: msg }
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { fetchTimeSeries, loading, error }
}
