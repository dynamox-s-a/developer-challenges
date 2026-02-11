import { Router } from 'express'
import authRoutes from '../modules/auth/auth.routes'
import { machineRoutes } from '../modules/machines/machine.routes'
import { monitoringPointRoutes } from '../modules/monitoring-points/monitoring-point.routes'

const router = Router()

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok'
  })
})

router.use('/auth', authRoutes)
router.use('/machines', machineRoutes)
router.use('/monitoring-points', monitoringPointRoutes)

export default router
