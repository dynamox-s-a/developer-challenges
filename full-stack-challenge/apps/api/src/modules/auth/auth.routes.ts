import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../shared/validate';
import { loginSchema } from './auth.schemas';
import * as authService from './auth.service';

export const authRouter = Router();

authRouter.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post('/logout', requireAuth, (_req, res) => {
  // Stateless JWT: client discards the token. Endpoint exists for explicit UX/API symmetry.
  res.status(204).send();
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});
