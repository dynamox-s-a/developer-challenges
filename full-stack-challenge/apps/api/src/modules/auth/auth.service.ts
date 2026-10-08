import type { AuthUserDto } from '@dynapredict/shared-types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../errors/AppError';
import type { LoginInput } from './auth.schemas';

export type AuthUser = AuthUserDto;

const JWT_ALGORITHM = 'HS256';

/**
 * Checks the single fixed credential from the environment and returns a signed
 * token. Wrong email and wrong password get the same error, and bcrypt runs in
 * both cases, so neither the message nor the timing reveals the valid email.
 */
export async function login({ email, password }: LoginInput) {
  const emailMatches = email === env.AUTH_EMAIL.toLowerCase();
  const passwordMatches = await bcrypt.compare(
    password,
    env.AUTH_PASSWORD_HASH,
  );
  if (!emailMatches || !passwordMatches) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const user: AuthUser = { email: env.AUTH_EMAIL };
  const token = jwt.sign({}, env.JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    subject: user.email,
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
  return { user, token };
}

/** Returns the user a token was issued to, or throws 401 if it is not valid. */
export function verifyToken(token: string | undefined): AuthUser {
  if (!token) throw AppError.unauthorized();
  try {
    // Pinning the algorithm rejects tokens re-signed with "none" or RS/HS confusion.
    const payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
    });
    if (typeof payload === 'string' || !payload.sub) {
      throw AppError.unauthorized();
    }
    return { email: payload.sub };
  } catch {
    throw AppError.unauthorized('Session expired or invalid');
  }
}
