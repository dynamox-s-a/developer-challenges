import { PrismaService } from '../prisma/prisma.service';
import { SEED_SECTOR, seedSector } from './seed-sector';
import { seedUser } from './seed-user';

/**
 * Entry point of the seed, bundled with the API as `dist/seed.js` and run by
 * `prisma db seed`. Prisma loads `.env` through prisma.config.ts and passes the
 * variables on; elsewhere they come from the environment. Idempotent, so it can run
 * after every migration.
 */
async function main(): Promise<void> {
  const prisma = new PrismaService();
  try {
    const user = await seedUser(prisma, {
      email: process.env.SEED_USER_EMAIL,
      password: process.env.SEED_USER_PASSWORD,
    });
    console.log(`Seed user: ${user.status}.`);
    const sector = await seedSector(prisma, user.userId);
    console.log(`Seed sector ${SEED_SECTOR.code}: ${sector}.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
