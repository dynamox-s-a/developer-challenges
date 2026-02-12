import axios from 'axios'
import { tokenStorage } from './tokenStorage'

const rawBaseUrl = import.meta.env.VITE_API_URL ?? ''
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '')
const apiBaseUrl = normalizedBaseUrl.endsWith('/api')
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api`

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000
})

api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
