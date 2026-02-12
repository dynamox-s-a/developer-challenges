import {
  MonitoringAnalysisResponseSchema,
  type MonitoringAnalysisResponse,
} from '@/types/zod/monitoring-analysis'
import { useCallback, useState } from 'react'

type UseAnalysisHook = {
  useAnalysis: () => Promise<MonitoringAnalysisResponse>
  loading: boolean
  error: string | null
  success: boolean
}

export const useMonitoringAnalysis = (): UseAnalysisHook => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const useAnalysis = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/monitoring/point/analysis', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const resp = await response.json()
      const parsed = MonitoringAnalysisResponseSchema.parse(resp)

      if (!parsed.success) {
        setError(parsed.message)
        return parsed
      }

      setSuccess(true)
      return parsed
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMsg)
      return MonitoringAnalysisResponseSchema.parse({
        success: false,
        message: errorMsg,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  return { useAnalysis, loading, error, success }
}
