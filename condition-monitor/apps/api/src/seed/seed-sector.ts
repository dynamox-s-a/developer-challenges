import type { PrismaClient } from '../generated/prisma/client';

/** The sector the application starts with (assumption B9): the drying section. */
export const SEED_SECTOR = { code: 'DRY', name: 'Drying section' } as const;

export type SeedSectorStatus = 'created' | 'unchanged';

/**
 * Creates the starting sector for its owner. Idempotent: once the code exists, the seed
 * leaves it alone, so a name edited on screen is never reset by a later run.
 */
export async function seedSector(prisma: PrismaClient, ownerId: string): Promise<SeedSectorStatus> {
  const existing = await prisma.sector.findUnique({ where: { code: SEED_SECTOR.code } });
  if (existing) {
    return 'unchanged';
  }
  await prisma.sector.create({ data: { ...SEED_SECTOR, ownerId } });
  return 'created';
}
