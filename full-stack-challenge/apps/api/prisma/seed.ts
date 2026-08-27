import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Dynamox@123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@dynamox.test' },
    update: {
      passwordHash,
      name: 'Dynamox Admin',
    },
    create: {
      email: 'admin@dynamox.test',
      passwordHash,
      name: 'Dynamox Admin',
    },
  });

  console.log('Seed completed: admin@dynamox.test / Dynamox@123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
