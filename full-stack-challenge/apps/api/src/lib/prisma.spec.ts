import { prisma } from './prisma';

// Integration test: needs the postgres-test service (docker compose up -d postgres-test).
describe('prisma', () => {
  afterAll(() => prisma.$disconnect());

  it('connects to the test database', async () => {
    const [row] = await prisma.$queryRaw<
      { database: string }[]
    >`SELECT current_database() AS database`;

    expect(row.database).toBe('dynapredict_test');
  });

  it('shares one client across imports', async () => {
    const { prisma: again } = await import('./prisma');
    expect(again).toBe(prisma);
  });
});
