import { Router } from 'express'
import { ensureAuth } from '../../core/middlewares/ensureAuth'
import * as TelemetryController from './telemetry.controller'

export const telemetryRoutes = Router()

telemetryRoutes.use(ensureAuth)

telemetryRoutes.post('/:uuid/time-series', TelemetryController.create)
telemetryRoutes.get('/:uuid/time-series', TelemetryController.list)
telemetryRoutes.get('/:uuid/time-series/count', TelemetryController.count)
telemetryRoutes.get('/:uuid/time-series/metrics', TelemetryController.metrics)
telemetryRoutes.delete('/:uuid/time-series', TelemetryController.remove)

telemetryRoutes.delete(
  '/telemetry/batches/:uuid',
  TelemetryController.removeBatch
)
