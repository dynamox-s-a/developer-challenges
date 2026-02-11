import { CreateMonitoringPointDto, MonitoringPointResponse, MonitoringPointResponseSchema } from "@/types/zod/monitoring-point"
import { useCallback, useState } from "react"

type UseMonitoringPointsHook = {
  createMonitoringPoint: (dto: CreateMonitoringPointDto) => Promise<MonitoringPointResponse>,
  loading: boolean,
  error: string | null,
  success: boolean
}

export const useCreateMonitoringPoint = (): UseMonitoringPointsHook => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const createMonitoringPoint = useCallback(async (dto: CreateMonitoringPointDto) => {
      setLoading(true)
      setError(null)
      setSuccess(false)
  
      try {
        const response = await fetch('/api/monitoring/point', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dto),
        })
  
        const resp = await response.json()
        const parsed = MonitoringPointResponseSchema.parse(resp)
  
        if (!parsed.success) {
          setError(parsed.message)
          return parsed
        }
  
        setSuccess(true)
        return parsed
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido'
        setError(errorMsg)
        return MonitoringPointResponseSchema.parse(
          { success: false, message: errorMsg }
        )
      } finally {
        setLoading(false)
      }
    }, [])

  return {createMonitoringPoint, loading, error, success}
}