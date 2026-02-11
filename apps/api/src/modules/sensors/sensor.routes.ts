import { Router } from 'express'

import * as controller from './sensor.controller'
import { ensureAuth } from '../../core/middlewares/ensureAuth'

export const sensorRoutes = Router()

sensorRoutes.use(ensureAuth)

sensorRoutes.post('/', controller.create)
sensorRoutes.get('/', controller.list)
sensorRoutes.patch('/:uuid', controller.update)
sensorRoutes.delete('/:uuid', controller.remove)
