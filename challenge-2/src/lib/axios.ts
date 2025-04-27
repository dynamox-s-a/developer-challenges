import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL

export const clientAxios = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// INTERCEPT REQUEST
clientAxios.interceptors.request.use(
  async (config) => {
    if (config.url === '/login' || config.url === '/signup') {
      return config
    }

    const accessToken = localStorage.getItem('token')

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// INTERCEPT RESPONSE
clientAxios.interceptors.response.use((response) => {
  return response
})
