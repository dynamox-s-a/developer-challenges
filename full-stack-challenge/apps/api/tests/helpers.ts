import jwt from 'jsonwebtoken';
import { AUTH_COOKIE_NAME } from '../src/config/auth';
import { env } from '../src/config/env';
import { prisma } from '../src/lib/prisma';

/** A valid session cookie for the fixed test user, without going through bcrypt. */
export function authCookie(): string {
  const token = jwt.sign({}, env.JWT_SECRET, {
    algorithm: 'HS256',
    subject: env.AUTH_EMAIL,
    expiresIn: '5m',
  });
  return `${AUTH_COOKIE_NAME}=${token}`;
}

/** Empties every table. Machines cascade to points, sensors and readings. */
export async function resetDatabase(): Promise<void> {
  await prisma.machine.deleteMany();
}

export const UNKNOWN_ID = '00000000-0000-4000-8000-000000000000';
