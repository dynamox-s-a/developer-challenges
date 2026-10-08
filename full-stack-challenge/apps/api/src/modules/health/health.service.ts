import { prisma } from '../../lib/prisma';

/** Long enough for a healthy pool, short enough for orchestrator probes. */
export const DB_CHECK_TIMEOUT_MS = 1000;

/**
 * Pings the database with `SELECT 1`. Any failure, including no answer within
 * `timeoutMs` (e.g. a network partition that never refuses the connection),
 * counts as down. Never throws.
 */
export async function isDatabaseUp(
  timeoutMs = DB_CHECK_TIMEOUT_MS,
): Promise<boolean> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Database check timed out after ${timeoutMs}ms`)),
      timeoutMs,
    );
  });
  try {
    await Promise.race([prisma.$queryRaw`SELECT 1`, timeout]);
    return true;
  } catch (error) {
    // Logged for operators only; the response never carries the details.
    console.error('Health check: database unavailable', error);
    return false;
  } finally {
    clearTimeout(timer);
  }
}
