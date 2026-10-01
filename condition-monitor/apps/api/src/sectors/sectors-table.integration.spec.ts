import { PrismaService } from '../prisma/prisma.service';
import { seedUser } from '../seed/seed-user';
import { resetDatabase } from '../../test/reset-database';

/** The sectors table enforces its rules even when the application does not. */
describe('sectors table', () => {
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

  function insert(code: string, name = 'Drying section', owner = ownerId) {
    return prisma.$executeRaw`
      INSERT INTO sectors (owner_id, code, name, updated_at)
      VALUES (${owner}::uuid, ${code}, ${name}, now())`;
  }

  it('accepts codes of 2 and 10 uppercase letters or digits', async () => {
    await insert('DR');
    await insert('PM1DRY2026');

    expect(await prisma.sector.count()).toBe(2);
  });

  it('rejects codes of 1 or 11 characters, lowercase or with symbols', async () => {
    for (const code of ['D', 'PM1DRY20261', 'dry', 'PM-1', 'DR Y']) {
      await expect(insert(code)).rejects.toThrow(/sectors_code_format_check/);
    }
  });

  it('rejects the same code twice', async () => {
    await insert('DRY');

    await expect(insert('DRY', 'Another name')).rejects.toThrow(/sectors_code_key/);
  });

  it('accepts a name of 1 and 100 characters and rejects 101, empty or padded', async () => {
    await insert('AA', 'A');
    await insert('BB', 'N'.repeat(100));

    for (const name of ['N'.repeat(101), '', ' Drying', 'Drying ']) {
      await expect(insert('CC', name)).rejects.toThrow(/sectors_name_check/);
    }
  });

  it('rejects a sector without an existing owner', async () => {
    await expect(
      insert('DRY', 'Drying section', '9f9f9f9f-0000-4000-8000-000000000000'),
    ).rejects.toThrow(/sectors_owner_id_fkey/);
  });

  it('refuses to delete a user who still owns sectors', async () => {
    await insert('DRY');

    await expect(prisma.$executeRaw`DELETE FROM users WHERE id = ${ownerId}::uuid`).rejects.toThrow(
      /sectors_owner_id_fkey/,
    );
  });
});
