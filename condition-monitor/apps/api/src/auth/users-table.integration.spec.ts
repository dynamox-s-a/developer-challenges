import { PrismaService } from '../prisma/prisma.service';
import { resetDatabase } from '../../test/reset-database';
import { hashPassword } from './password';

/** The users table enforces its rules even when the application does not. */
describe('users table', () => {
  const prisma = new PrismaService();
  let validHash: string;

  beforeAll(async () => {
    validHash = await hashPassword('correct horse battery');
  });

  beforeEach(async () => {
    await resetDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function insert(email: string, passwordHash = validHash) {
    return prisma.$executeRaw`
      INSERT INTO users (email, password_hash, updated_at)
      VALUES (${email}, ${passwordHash}, now())`;
  }

  it('accepts a lowercase email with a bcrypt hash, and generates the id', async () => {
    await insert('operator@plant.test');

    const [row] = await prisma.$queryRaw<{ id: string }[]>`SELECT id::text FROM users`;
    expect(row.id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('rejects the same email twice', async () => {
    await insert('operator@plant.test');

    await expect(insert('operator@plant.test')).rejects.toThrow(/users_email_key/);
  });

  it('rejects an email that is not lowercase and trimmed', async () => {
    await expect(insert('Operator@plant.test')).rejects.toThrow(/users_email_normalized_check/);
    await expect(insert(' operator@plant.test')).rejects.toThrow(/users_email_normalized_check/);
    await expect(insert('')).rejects.toThrow(/users_email_normalized_check/);
  });

  it('rejects a password that is not a bcrypt hash', async () => {
    await expect(insert('operator@plant.test', 'correct horse battery')).rejects.toThrow(
      /users_password_hash_bcrypt_check/,
    );
  });
});
