import { AxiosError } from 'axios'
import type { ApiErrorResponse } from '../types/api.types'

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as Partial<ApiErrorResponse> | undefined
    if (typeof apiError?.message === 'string' && apiError.message.trim()) {
      return apiError.message
    }
    if (error.message) return error.message
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
