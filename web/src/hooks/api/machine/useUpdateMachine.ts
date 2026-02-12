import { useState, useCallback } from 'react'
import type { MachineResponse, UpdateMachineDto } from '@/types/zod/machine'

export const useUpdateMachine = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateMachine = useCallback(
    async (
      machineId: string,
      data: UpdateMachineDto,
    ): Promise<MachineResponse> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/machine/${machineId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        const result = await response.json()

        console.log('Parametro ID', machineId)

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Erro ao atualizar máquina')
        }

        return result
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

  return { updateMachine, loading, error }
}
