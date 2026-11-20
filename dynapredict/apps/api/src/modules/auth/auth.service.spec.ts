import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getCurrentUser, login } from './auth.service.ts';

// Cria a função falsa do banco antes dos vi.mock (que o Vitest sobe para o topo)
const { findUnique } = vi.hoisted(() => ({ findUnique: vi.fn() }));

// Troca o env e o Prisma por versões falsas: o teste não precisa de .env nem de banco
vi.mock('../../config/env.ts', () => ({
  env: {
    JWT_SECRET: 'segredo-de-teste-com-mais-de-32-caracteres',
    JWT_EXPIRES_IN: 3600,
  },
}));
vi.mock('../../lib/prisma.ts', () => ({
  prisma: { user: { findUnique } },
}));

const user = {
  id: 'user-1',
  email: 'admin@dynamox.com',
  passwordHash: bcrypt.hashSync('dynapredict123', 4),
};

describe('login', () => {
  beforeEach(() => findUnique.mockReset());

  it('should return a token and the user when the credentials are right', async () => {
    findUnique.mockResolvedValue(user);

    const result = await login({
      email: user.email,
      password: 'dynapredict123',
    });

    expect(result.user).toEqual({ id: 'user-1', email: 'admin@dynamox.com' });
    expect(jwt.decode(result.token)).toMatchObject({
      sub: 'user-1',
      email: 'admin@dynamox.com',
    });
  });

  it('should reject a wrong password with 401', async () => {
    findUnique.mockResolvedValue(user);

    await expect(
      login({ email: user.email, password: 'senha-errada' }),
    ).rejects.toMatchObject({ statusCode: 401, code: 'INVALID_CREDENTIALS' });
  });

  it('should reject an unknown email with the same 401', async () => {
    findUnique.mockResolvedValue(null);

    await expect(
      login({ email: 'ninguem@dynamox.com', password: 'dynapredict123' }),
    ).rejects.toMatchObject({ statusCode: 401, code: 'INVALID_CREDENTIALS' });
  });
});


describe('getCurrentUser', () => {
  beforeEach(() => findUnique.mockReset());

  it('should return the user, asking the database only for id and email', async () => {
    findUnique.mockResolvedValue({ id: 'user-1', email: 'admin@dynamox.com' });

    const result = await getCurrentUser('user-1');

    expect(result).toEqual({ id: 'user-1', email: 'admin@dynamox.com' });
    expect(findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      select: { id: true, email: true },
    });
  });

  it('should reject with 401 when the user no longer exists', async () => {
    findUnique.mockResolvedValue(null);

    await expect(getCurrentUser('user-apagado')).rejects.toMatchObject({
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  });
});