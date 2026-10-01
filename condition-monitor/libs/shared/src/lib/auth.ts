import { z } from 'zod';

/**
 * bcrypt reads only the first 72 bytes of a password and silently ignores the rest, so
 * a longer password would be accepted and cut without anyone knowing. It is rejected
 * instead. The limit is in bytes, not characters: accented letters take two.
 */
export const PASSWORD_MAX_BYTES = 72;

export function passwordByteLength(password: string): number {
  return new TextEncoder().encode(password).length;
}

/** Body of `POST /api/auth/login` (API contract, "Authentication"). */
export const loginRequestSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email('Must be a valid email address.')),
  password: z
    .string()
    .min(1, 'Required.')
    .refine(
      (password) => passwordByteLength(password) <= PASSWORD_MAX_BYTES,
      `Must be at most ${PASSWORD_MAX_BYTES} bytes.`,
    ),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

/** Answer of `GET /api/auth/me`: who the session belongs to. */
export interface SessionUser {
  id: string;
  email: string;
}
