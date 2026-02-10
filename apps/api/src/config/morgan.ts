import morgan from 'morgan'

export const morganMiddleware =
  process.env.NODE_ENV !== 'production' ? morgan('dev') : morgan('combined')
