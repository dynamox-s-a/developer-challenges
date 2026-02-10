export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: unknown
}

export interface ApiErrorResponse {
  success: false
  message?: string
  error?: unknown
}
