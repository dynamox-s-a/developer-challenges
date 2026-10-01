import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';

/**
 * bcrypt work factor (assumption A1). Each step doubles the cost of a hash. Measured on
 * the development machine with the native package (median of 5 checks, idle): cost 10
 * takes 57 ms and cost 12 takes 226 ms. Cost 12 would leave little of the 350 ms latency
 * budget of a login under load, so the API uses 10, the minimum OWASP recommends.
 *
 * The native `bcrypt` package computes in Node's thread pool. The pure JavaScript
 * `bcryptjs` used before ran on the one thread that serves every request, so each login
 * delayed all the others (docs/performance.md).
 */
export const BCRYPT_COST = 10;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Whether a stored hash was made with another work factor and should be redone. */
export function needsRehash(hash: string): boolean {
  return bcrypt.getRounds(hash) !== BCRYPT_COST;
}

/**
 * A hash of a random value nobody knows, made once at startup with the current cost.
 * Checking a password against it when the email does not exist takes as long as a real
 * check, so response time does not reveal which emails are registered.
 */
export const UNKNOWN_USER_HASH = bcrypt.hashSync(randomBytes(32).toString('hex'), BCRYPT_COST);
