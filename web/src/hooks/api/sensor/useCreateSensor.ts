import { CreateMonitoringPointDto, MonitoringPointResponse, MonitoringPointResponseSchema } from "@/types/zod/monitoring-point"
import { CreateSensorDto, SensorResponse, SensorResponseSchema } from "@/types/zod/sensor"
import { useCallback, useState } from "react"

type UseSensorHook = {
  createSensor: (dto: CreateSensorDto) => Promise<SensorResponse>,
  loading: boolean,
  error: string | null,
  success: boolean
}

export const useCreateSensor = (): UseSensorHook => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const createSensor = useCallback(async (dto: CreateSensorDto) => {
      setLoading(true)
      setError(null)
      setSuccess(false)
  
      try {
        const response = await fetch('/api/sensor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dto),
        })
  
        const resp = await response.json()
        const parsed = SensorResponseSchema.parse(resp)
  
        if (!parsed.success) {
          setError(parsed.message)
          return parsed
        }
  
        setSuccess(true)
        return parsed
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido'
        setError(errorMsg)
        return SensorResponseSchema.parse(
          { success: false, message: errorMsg }
        )
      } finally {
        setLoading(false)
      }
    }, [])

  return {createSensor, loading, error, success}
}