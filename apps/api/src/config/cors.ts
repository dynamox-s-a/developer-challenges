import cors from 'cors'

const devOrigins = [
  'http://localhost:5000',
  'http://localhost:5174',
  'http://172.19.0.3:5000'
]

const prodOrigins = ['https://app.dynamox.com']

const allowedOrigins =
  process.env.NODE_ENV === 'production' ? prodOrigins : devOrigins

export const getCorsMiddleware = () =>
  cors({
    origin: (
      origin: string | undefined,
      callback: (arg0: Error | null, arg1: boolean | undefined) => any
    ) => {
      if (!origin) {
        return callback(null, true)
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`),
        undefined
      )
    },
    credentials: true
  })
