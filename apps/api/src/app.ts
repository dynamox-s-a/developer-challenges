import express from 'express'
import { getCorsMiddleware } from './config/cors'
import { helmetMiddleware } from './config/helmet'
import routes from './routes'
import { morganMiddleware } from './config/morgan'
import { errorHandler } from './core/middlewares/errorHandler'

export const createApp = () => {
  const app = express()

  app.use(helmetMiddleware)
  app.use(morganMiddleware)
  app.use(getCorsMiddleware())
  app.use(express.json())

  app.use('/api', routes)

  app.use(errorHandler)

  return app
}
