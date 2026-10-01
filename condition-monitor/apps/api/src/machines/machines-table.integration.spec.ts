import { PrismaService } from '../prisma/prisma.service';
import { seedUser } from '../seed/seed-user';
import { resetDatabase } from '../../test/reset-database';

/** The machines table enforces its rules even when the application does not. */
describe('machines table', () => {
  const prisma = new PrismaService();
  let dry: string;
  let prs: string;

  beforeEach(async () => {
    await resetDatabase(prisma);
    const { userId } = await seedUser(prisma, {
      email: 'operator@plant.test',
      password: 'correct horse battery',
    });
    dry = (await prisma.sector.create({ data: { ownerId: userId, code: 'DRY', name: 'Drying' } }))
      .id;
    prs = (await prisma.sector.create({ data: { ownerId: userId, code: 'PRS', name: 'Press' } }))
      .id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function insert(sectorId: string, type: string, number: number, name = 'Exhaust fan') {
    return prisma.$executeRaw`
      INSERT INTO machines (sector_id, type, number, name, updated_at)
      VALUES (${sectorId}::uuid, ${type}::machine_type, ${number}, ${name}, now())`;
  }

  it('accepts numbers 1 and 999 and rejects 0 and 1000', async () => {
    await insert(dry, 'FAN', 1);
    await insert(dry, 'FAN', 999);

    for (const number of [0, 1000]) {
      await expect(insert(dry, 'FAN', number)).rejects.toThrow(/machines_number_range_check/);
    }
  });

  it('rejects the same tag twice: same sector, type and number', async () => {
    await insert(dry, 'FAN', 1);

    await expect(insert(dry, 'FAN', 1, 'Another fan')).rejects.toThrow(
      /machines_sector_id_type_number_key/,
    );
  });

  it('accepts the same number for another type or in another sector', async () => {
    await insert(dry, 'FAN', 1);
    await insert(dry, 'PUMP', 1);
    await insert(prs, 'FAN', 1);

    expect(await prisma.machine.count()).toBe(3);
  });

  it('accepts repeated names, as the tag identifies the machine (B2)', async () => {
    await insert(dry, 'FAN', 1, 'Exhaust fan');
    await insert(dry, 'FAN', 2, 'Exhaust fan');

    expect(await prisma.machine.count({ where: { name: 'Exhaust fan' } })).toBe(2);
  });

  it('accepts a name of 1 and 100 characters and rejects 101, empty or padded', async () => {
    await insert(dry, 'FAN', 1, 'A');
    await insert(dry, 'FAN', 2, 'N'.repeat(100));

    for (const name of ['N'.repeat(101), '', ' Fan', 'Fan ']) {
      await expect(insert(dry, 'FAN', 3, name)).rejects.toThrow(/machines_name_check/);
    }
  });

  it('rejects a type outside the list', async () => {
    await expect(insert(dry, 'COMPRESSOR', 1)).rejects.toThrow(/machine_type/);
  });

  it('refuses to delete a sector that still has machines', async () => {
    await insert(dry, 'FAN', 1);

    await expect(prisma.$executeRaw`DELETE FROM sectors WHERE id = ${dry}::uuid`).rejects.toThrow(
      /machines_sector_id_fkey/,
    );
  });

  it('sorts types alphabetically, Fan before Pump', async () => {
    await insert(dry, 'PUMP', 1);
    await insert(dry, 'FAN', 1);

    const machines = await prisma.machine.findMany({ orderBy: { type: 'asc' } });

    expect(machines.map((machine) => machine.type)).toEqual(['FAN', 'PUMP']);
  });
});
