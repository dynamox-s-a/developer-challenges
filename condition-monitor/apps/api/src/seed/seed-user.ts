import { PASSWORD_MAX_BYTES, passwordByteLength } from '@condition-monitor/shared';
import type { PrismaClient } from '../generated/prisma/client';
import { hashPassword, needsRehash, verifyPassword } from '../auth/password';

export interface SeedUserInput {
  email: string | undefined;
  password: string | undefined;
}

export type SeedUserStatus = 'created' | 'password updated' | 'rehashed' | 'unchanged';

export interface SeedUserResult {
  status: SeedUserStatus;
  /** The seeded user, owner of the seeded sector. */
  userId: string;
}

const MIN_PASSWORD_LENGTH = 8;

/**
 * Creates the fixed user of assumption A1 from the environment. Idempotent: running it
 * again changes nothing unless the configured password changed, and it says which case
 * happened rather than only not failing.
 */
export async function seedUser(
  prisma: PrismaClient,
  input: SeedUserInput,
): Promise<SeedUserResult> {
  const email = input.email?.trim().toLowerCase();
  const password = input.password;
  if (!email) {
    throw new Error('SEED_USER_EMAIL is not set. Copy .env.example to .env or set it.');
  }
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`SEED_USER_PASSWORD must have at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  // The same limit the login form applies: a longer password could never log in.
  if (passwordByteLength(password) > PASSWORD_MAX_BYTES) {
    throw new Error(`SEED_USER_PASSWORD must have at most ${PASSWORD_MAX_BYTES} bytes.`);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const created = await prisma.user.create({
      data: { email, passwordHash: await hashPassword(password) },
    });
    return { status: 'created', userId: created.id };
  }
  if (await verifyPassword(password, existing.passwordHash)) {
    if (!needsRehash(existing.passwordHash)) {
      return { status: 'unchanged', userId: existing.id };
    }
    // Same password, older work factor: redo the hash so logins get the current cost.
    await prisma.user.update({
      where: { email },
      data: { passwordHash: await hashPassword(password) },
    });
    return { status: 'rehashed', userId: existing.id };
  }
  await prisma.user.update({
    where: { email },
    data: { passwordHash: await hashPassword(password) },
  });
  return { status: 'password updated', userId: existing.id };
}
