import axios from 'axios'

export const baseURL = import.meta.env.VITE_BACK_BASE_URL

export const api = axios.create({
  baseURL,
})

api.interceptors.request.use(
  async config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.authorization = `${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)
