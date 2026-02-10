import { Router } from 'express'
import authRoutes from '../modules/auth/auth.routes'

const router = Router()

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok'
  })
})

router.use('/auth', authRoutes)

export default router
