import { Router } from 'express'
import { requireAuth } from '../../core/auth/auth.middleware'
import * as authController from './auth.controller'

const router = Router()

router.post('/login', authController.login)
router.post('/register', authController.register)
router.get('/me', requireAuth, authController.me)

export default router
