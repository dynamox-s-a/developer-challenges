import { Router } from 'express'

import * as controller from './machine.controller'
import { ensureAuth } from '../../core/middlewares/ensureAuth'

export const machineRoutes = Router()

machineRoutes.use(ensureAuth)

machineRoutes.post('/', controller.create)
machineRoutes.get('/', controller.list)
machineRoutes.patch('/:uuid', controller.update)
machineRoutes.delete('/:uuid', controller.remove)
