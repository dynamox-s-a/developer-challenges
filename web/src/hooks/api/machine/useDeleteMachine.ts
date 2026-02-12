import { MachineResponseSchema } from '@/types/zod/machine'
import { useCallback, useState } from 'react'
import type { MachineResponse } from '@/types/zod/machine'

type UseMachineHook = {
  deleteMachine: (id: string) => Promise<MachineResponse>
  loading: boolean
  error: string | null
  success: boolean
}

export const useDeleteMachine = (): UseMachineHook => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const deleteMachine = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/machine', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(id),
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

  return { deleteMachine: deleteMachine, loading, error, success }
}
