import { MachineResponseSchema } from '@/types/zod/machine'
import { useCallback, useState } from 'react'
import type { MachineResponse } from '@/types/zod/machine'

type UseMachineHook = {
  getMachines: () => Promise<MachineResponse>
  loading: boolean
  error: string | null
  success: boolean
}

export const useGetMachines = (): UseMachineHook => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const getMachines = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/machine', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const resp = await response.json()
      const parsed = MachineResponseSchema.parse(resp)

      if (!parsed.success) {
        setError(parsed.message)
        return parsed
      }

      setSuccess(true)
      return parsed
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMsg)
      return MachineResponseSchema.parse({ success: false, message: errorMsg })
    } finally {
      setLoading(false)
    }
  }, [])

  return { getMachines, loading, error, success }
}
