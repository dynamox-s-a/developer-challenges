import { PrismaService } from './prisma.service';

/** Proves the API reaches PostgreSQL through Prisma and the driver adapter. */
describe('PrismaService against PostgreSQL', () => {
  const prisma = new PrismaService();

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  it('runs a query on the test database', async () => {
    const [row] = await prisma.$queryRaw<{ database: string; major: number }[]>`
      SELECT current_database() AS database,
             current_setting('server_version_num')::int / 10000 AS major`;

    expect(row.database).toBe('condition_monitor_test');
    expect(row.major).toBeGreaterThanOrEqual(15);
  });
});
