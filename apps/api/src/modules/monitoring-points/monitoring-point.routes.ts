import { Router } from 'express'

import * as controller from './monitoring-point.controller'
import { ensureAuth } from '../../core/middlewares/ensureAuth'

export const monitoringPointRoutes = Router()

monitoringPointRoutes.use(ensureAuth)

monitoringPointRoutes.post('/', controller.create)
monitoringPointRoutes.get('/', controller.list)
monitoringPointRoutes.patch('/:uuid', controller.update)
monitoringPointRoutes.delete('/:uuid', controller.remove)
