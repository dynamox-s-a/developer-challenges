import { useCallback, useState } from 'react'
import {
  type CreateTimeSeriesBatchDto,
  type CreateTimeSeriesPointDto,
  type TimeSeriesDataPoint,
  TimeSeriesDataPointResponseSchema,
} from '@/types/zod/timeSeries'

type UseCreateTimeSeriesPointsReturn = {
  createPoints: (
    data: CreateTimeSeriesPointDto | CreateTimeSeriesBatchDto,
  ) => Promise<{
    success: boolean
    data?: TimeSeriesDataPoint | TimeSeriesDataPoint[]
    message?: string
  }>
  loading: boolean
  error: string | null
  success: boolean
}

export const useCreateTimeSeriesPoints =
  (): UseCreateTimeSeriesPointsReturn => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const createPoints = useCallback(
      async (data: CreateTimeSeriesPointDto | CreateTimeSeriesBatchDto) => {
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
          const response = await fetch('/api/time-series', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })

          const resp = await response.json()
          const parsed = TimeSeriesDataPointResponseSchema.parse(resp)

          if (!parsed.success) {
            setError(parsed.message)
            return { success: false, message: parsed.message }
          }

          setSuccess(true)
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

    return { createPoints, loading, error, success }
  }
