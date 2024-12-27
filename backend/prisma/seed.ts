import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seeds the database with initial sensor data.
 * @returns {Promise} A promise that resolves when the seeding is complete.
 */
async function main() {
  const sensors = [{ name: 'TcAg' }, { name: 'TcAs' }, { name: 'HF+' }];

  for (const sensor of sensors) {
    await prisma.sensor.create({
      data: sensor,
    });
  }

  console.log('Sensors seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
