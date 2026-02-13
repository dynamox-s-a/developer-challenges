import { useCallback, useState } from 'react'
import { createResponseSchema } from '@/utils/createResponse'
import { z } from 'zod'

const DeleteAllResponseSchema = createResponseSchema(z.any())

export const useDeleteAllByMonitoringPoint = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteAll = useCallback(
    async (
      monitoringPointId: string,
    ): Promise<{ success: boolean; message?: string }> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/time-series/${monitoringPointId}`, {
          method: 'DELETE',
        })
        const resp = await response.json()
        const parsed = DeleteAllResponseSchema.parse(resp)

        if (!parsed.success) {
          setError(parsed.message)
          return { success: false, message: parsed.message }
        }

        return { success: true, message: parsed.message }
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

  return { deleteAll, loading, error }
}
