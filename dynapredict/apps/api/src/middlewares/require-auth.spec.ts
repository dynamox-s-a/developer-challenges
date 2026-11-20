import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { signToken } from '../lib/jwt.ts';
import { requireAuth } from './require-auth.ts';

// Cria a chave de teste antes do vi.mock (que o Vitest sobe para o topo)
const { SECRET } = vi.hoisted(() => ({
  SECRET: 'segredo-de-teste-com-mais-de-32-caracteres',
}));

// Troca o env por uma versão falsa: o teste não precisa de .env
vi.mock('../config/env.ts', () => ({
  env: { JWT_SECRET: SECRET, JWT_EXPIRES_IN: 3600 },
}));

const payload = { sub: 'user-1', email: 'admin@dynamox.com' };

// Roda o porteiro com um req falso, que só tem o cabeçalho Authorization
function run(authorization?: string) {
  const req = { headers: { authorization } } as Request;
  const next = vi.fn();
  requireAuth(req, {} as Response, next as NextFunction);
  return { req, next };
}

describe('requireAuth', () => {
  it('should let a valid token through and fill req.user', () => {
    const { req, next } = run(`Bearer ${signToken(payload)}`);

    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalledOnce();
  });

  it('should reject a request without token', () => {
    expect(() => run()).toThrow('Token de acesso ausente');
  });

  it('should reject a header without the "Bearer " prefix', () => {
    expect(() => run(signToken(payload))).toThrow('Token de acesso ausente');
  });

  it('should reject a token signed with another secret', () => {
    const forged = jwt.sign(payload, 'outra-chave-que-a-api-nao-conhece-1234');

    expect(() => run(`Bearer ${forged}`)).toThrow(
      'Token inválido ou expirado',
    );
  });

  it('should reject an expired token', () => {
    const anHourAgo = Math.floor(Date.now() / 1000) - 3600;
    const expired = jwt.sign({ ...payload, exp: anHourAgo }, SECRET);

    expect(() => run(`Bearer ${expired}`)).toThrow(
      'Token inválido ou expirado',
    );
  });
});