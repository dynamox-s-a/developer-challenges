import {
  MachineResponseSchema,
  type CreateMachineDto,
} from '@/types/zod/machine'
import { useCallback, useState } from 'react'
import type { MachineResponse } from '@/types/zod/machine'

type UseMachineHook = {
  createMachine: (data: CreateMachineDto) => Promise<MachineResponse>
  loading: boolean
  error: string | null
  success: boolean
}

export const useCreateMachine = (): UseMachineHook => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const createMachine = useCallback(async (data: CreateMachineDto) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/machine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

  return { createMachine, loading, error, success }
}
