import { Router } from 'express';
import { requireAuth } from '../../middlewares/requireAuth';
import { validate } from '../../middlewares/validate';
import * as authController from './auth.controller';
import { loginSchema } from './auth.schemas';

export const authRoutes = Router();

authRoutes.post('/login', validate(loginSchema), authController.login);
authRoutes.post('/logout', authController.logout);
authRoutes.get('/me', requireAuth, authController.me);
