import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../shared/errors';
import type { LoginInput } from './auth.schemas';

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, 'Invalid email or password');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError(500, 'JWT secret is not configured');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN ?? '8h';
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    secret,
    { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] }
  );

  return {
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}
