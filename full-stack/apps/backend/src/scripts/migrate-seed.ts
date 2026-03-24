import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function main() {
  console.log('Running migrations...');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('Migrations completed');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }

  console.log('Seeding database...');
  try {
    execSync('npx prisma db seed', { stdio: 'inherit' });
    console.log('Seeding completed');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
