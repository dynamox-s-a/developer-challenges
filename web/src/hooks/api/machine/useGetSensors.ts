import { type SensorResponse, SensorResponseSchema } from '@/types/zod/sensor'
import { useCallback, useState } from 'react'

type UseSensorHook = {
  getSensors: (id: string) => Promise<SensorResponse>
  loading: boolean
  error: string | null
  success: boolean
}

export const useGetSensors = (): UseSensorHook => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const getSensors = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/machine/sensors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(id),
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
      return SensorResponseSchema.parse({ success: false, message: errorMsg })
    } finally {
      setLoading(false)
    }
  }, [])

  return { getSensors, loading, error, success }
}
