import bcrypt from 'bcrypt';
import { BCRYPT_COST, verifyPassword } from '../auth/password';
import { PrismaService } from '../prisma/prisma.service';
import { resetDatabase } from '../../test/reset-database';
import { seedUser } from './seed-user';

describe('seedUser', () => {
  const prisma = new PrismaService();

  beforeEach(async () => {
    await resetDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates the user with a normalized email and a hashed password', async () => {
    const result = await seedUser(prisma, {
      email: '  Operator@Plant.test ',
      password: 'correct horse battery',
    });

    const user = await prisma.user.findUniqueOrThrow({ where: { email: 'operator@plant.test' } });
    expect(result.status).toBe('created');
    expect(user.passwordHash).not.toContain('correct horse battery');
    expect(await verifyPassword('correct horse battery', user.passwordHash)).toBe(true);
  });

  it('changes nothing when run again with the same values', async () => {
    const input = { email: 'operator@plant.test', password: 'correct horse battery' };
    await seedUser(prisma, input);
    const before = await prisma.user.findUniqueOrThrow({ where: { email: input.email } });

    const result = await seedUser(prisma, input);

    const after = await prisma.user.findUniqueOrThrow({ where: { email: input.email } });
    expect(result.status).toBe('unchanged');
    expect(after).toEqual(before);
    expect(await prisma.user.count()).toBe(1);
  });

  it('redoes a hash made with an older cost, keeping the password', async () => {
    await prisma.user.create({
      data: {
        email: 'operator@plant.test',
        passwordHash: bcrypt.hashSync('correct horse battery', BCRYPT_COST + 2),
      },
    });
    const input = { email: 'operator@plant.test', password: 'correct horse battery' };

    expect((await seedUser(prisma, input)).status).toBe('rehashed');
    expect((await seedUser(prisma, input)).status).toBe('unchanged');
    const user = await prisma.user.findUniqueOrThrow({ where: { email: input.email } });
    expect(bcrypt.getRounds(user.passwordHash)).toBe(BCRYPT_COST);
  });

  it('updates the hash when the configured password changes', async () => {
    await seedUser(prisma, { email: 'operator@plant.test', password: 'correct horse battery' });

    const result = await seedUser(prisma, {
      email: 'operator@plant.test',
      password: 'new password 1',
    });

    const user = await prisma.user.findUniqueOrThrow({ where: { email: 'operator@plant.test' } });
    expect(result.status).toBe('password updated');
    expect(await verifyPassword('new password 1', user.passwordHash)).toBe(true);
  });

  it('refuses a password the login would reject: 72 bytes pass, 73 do not', async () => {
    await expect(
      seedUser(prisma, { email: 'operator@plant.test', password: 'a'.repeat(73) }),
    ).rejects.toThrow('at most 72 bytes');
    expect(await prisma.user.count()).toBe(0);
    expect(
      (await seedUser(prisma, { email: 'operator@plant.test', password: 'a'.repeat(72) })).status,
    ).toBe('created');
  });

  it('refuses to run without an email or with a short password, before writing', async () => {
    await expect(seedUser(prisma, { email: undefined, password: 'long enough' })).rejects.toThrow(
      'SEED_USER_EMAIL is not set',
    );
    await expect(
      seedUser(prisma, { email: 'operator@plant.test', password: '1234567' }),
    ).rejects.toThrow('at least 8 characters');
    expect(
      (await seedUser(prisma, { email: 'operator@plant.test', password: '12345678' })).status,
    ).toBe('created');
  });
});
