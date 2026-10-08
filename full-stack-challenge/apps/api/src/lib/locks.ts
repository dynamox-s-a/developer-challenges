import type { Prisma } from '../generated/prisma/client';

/**
 * Locks a machine row until the surrounding transaction ends. Changing a
 * machine's type and attaching a sensor both take this lock first, so under
 * READ COMMITTED they serialize per machine and the sensor rule can't be
 * bypassed by running them concurrently. A missing machine locks nothing.
 */
export async function lockMachine(
  tx: Prisma.TransactionClient,
  machineId: string,
): Promise<void> {
  await tx.$queryRaw`SELECT 1 FROM "Machine" WHERE "id" = ${machineId} FOR UPDATE`;
}
