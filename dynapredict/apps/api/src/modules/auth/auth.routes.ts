import { Router } from 'express';
import { loginSchema } from '@dynapredict/shared';
import { validateBody } from '../../middlewares/validate-body.ts';
import { login } from './auth.service.ts';

export const authRouter = Router();

// Pública: é aqui que se consegue o token
authRouter.post('/login', validateBody(loginSchema), async (req, res) => {
  const result = await login(req.body);
  res.json(result);
});