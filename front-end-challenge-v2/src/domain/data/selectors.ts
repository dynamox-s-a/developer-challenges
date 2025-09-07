import { AppState } from '@/app/store'
export const selectData = (s: AppState) => s.data
export const selectLoading = (s: AppState) => s.data?.loading ?? false
export const selectError = (s: AppState) => s.data?.error ?? null
export const selectAcceleration = (s: AppState) => s.data?.acceleration ?? []
export const selectVelocity = (s: AppState) => s.data?.velocity ?? []
export const selectTemperature = (s: AppState) => s.data?.temperature ?? []
