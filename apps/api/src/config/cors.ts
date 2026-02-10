import cors from 'cors'

const devOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
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

      return callback(new Error(`CORS blocked for origin: ${origin}`), undefined)
    },
    credentials: true
  })
