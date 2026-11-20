import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.ts';

// O que guardamos dentro do token. Atenção: qualquer um consegue LER um JWT
// (só a assinatura é protegida), então nunca coloque senha ou segredo aqui
const tokenPayloadSchema = z.object({
  sub: z.string(), // "subject": o id do usuário
  email: z.email(),
});

export type TokenPayload = z.infer<typeof tokenPayloadSchema>;

// Gera o token assinado com a chave secreta, válido por JWT_EXPIRES_IN segundos
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

// Confere a assinatura e a validade e devolve o conteúdo do token.
// Lança um erro se o token for falso, estiver vencido ou tiver outro formato
export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
  return tokenPayloadSchema.parse(decoded);
}