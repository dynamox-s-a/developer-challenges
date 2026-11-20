import { Router } from 'express';
import { loginSchema } from '@dynapredict/shared';
import { requireAuth } from '../../middlewares/require-auth.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import { getCurrentUser, login } from './auth.service.ts';

export const authRouter = Router();

// Pública: é aqui que se consegue o token
authRouter.post('/login', validateBody(loginSchema), async (req, res) => {
  const result = await login(req.body);
  res.json(result);
});

// Privada: o requireAuth roda antes e preenche req.user
authRouter.get('/me', requireAuth, async (req, res) => {
  // O "!" diz ao TypeScript: "pode confiar, o requireAuth garantiu que existe"
  const user = await getCurrentUser(req.user!.sub);
  res.json({ user });
});