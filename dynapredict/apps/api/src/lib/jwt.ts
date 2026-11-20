import jwt from 'jsonwebtoken';
import { env } from '../config/env.ts';

// O que guardamos dentro do token. Atenção: qualquer um consegue LER um JWT
// (só a assinatura é protegida), então nunca coloque senha ou segredo aqui
export type TokenPayload = {
  sub: string; // "subject": o id do usuário
  email: string;
};

// Gera o token assinado com a chave secreta, válido por JWT_EXPIRES_IN segundos
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}