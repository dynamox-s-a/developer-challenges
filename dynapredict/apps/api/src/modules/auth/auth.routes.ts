import { Router } from 'express';
import { loginSchema } from '@dynapredict/shared';
import { AppError } from '../../errors/app-error.ts';
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
  // O requireAuth já garante o req.user, mas o TypeScript não sabe disso.
  // Este if prova para ele (e protege se alguém tirar o requireAuth um dia)
  if (!req.user) {
    throw new AppError(401, 'UNAUTHORIZED', 'Token de acesso ausente');
  }

  const user = await getCurrentUser(req.user.sub);
  res.json({ user });
});
