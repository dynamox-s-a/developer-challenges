import { PrismaService } from '../prisma/prisma.service';
import { resetDatabase } from '../../test/reset-database';
import { SEED_SECTOR, seedSector } from './seed-sector';
import { seedUser } from './seed-user';

describe('seedSector', () => {
  const prisma = new PrismaService();
  let ownerId: string;

  beforeEach(async () => {
    await resetDatabase(prisma);
    ({ userId: ownerId } = await seedUser(prisma, {
      email: 'operator@plant.test',
      password: 'correct horse battery',
    }));
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates the drying section for the seeded user', async () => {
    expect(await seedSector(prisma, ownerId)).toBe('created');

    const sector = await prisma.sector.findUniqueOrThrow({ where: { code: 'DRY' } });
    expect(sector).toMatchObject({ code: 'DRY', name: 'Drying section', ownerId });
  });

  it('changes nothing when run again, keeping a name edited on screen', async () => {
    await seedSector(prisma, ownerId);
    await prisma.sector.update({
      where: { code: SEED_SECTOR.code },
      data: { name: 'Paper machine 1 drying' },
    });

    expect(await seedSector(prisma, ownerId)).toBe('unchanged');

    const sector = await prisma.sector.findUniqueOrThrow({ where: { code: 'DRY' } });
    expect(sector.name).toBe('Paper machine 1 drying');
    expect(await prisma.sector.count()).toBe(1);
  });
});
