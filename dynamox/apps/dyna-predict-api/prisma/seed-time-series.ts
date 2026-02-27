import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });
import { PrismaClient } from '../src/prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const COUNT = 50;

/** Generates COUNT timestamps going back COUNT hours from now, one per hour. */
function generateTimestamps(): Date[] {
  const now = Date.now();
  return Array.from({ length: COUNT }, (_, i) => new Date(now - (COUNT - i) * 60 * 60 * 1000));
}

/** Generates a realistic sensor value with small random noise around a baseline. */
function sensorValue(baseline: number, noise: number): number {
  return parseFloat((baseline + (Math.random() - 0.5) * 2 * noise).toFixed(4));
}

async function seedSensor(sensorId: number, label: string) {
  const timestamps = generateTimestamps();

  await prisma.timeSeries.createMany({
    data: timestamps.map((timestamp) => ({
      sensorId,
      temperature: sensorValue(65, 5),
      accelerationRms: sensorValue(2.4, 0.8),
      velocityRms: sensorValue(12, 3),
      timestamp,
    })),
  });

  console.log(`  ✓ ${COUNT} entries added for ${label} (sensorId=${sensorId})`);
}

async function main() {
  const sensors = await prisma.sensor.findMany({
    take: 2,
    orderBy: { id: 'asc' },
    select: { id: true, model: true, monitoringPoint: { select: { name: true } } },
  });

  if (sensors.length === 0) {
    console.log('No sensors found — skipping time-series seed. Run the main seed first.');
    return;
  }

  console.log(`Found ${sensors.length} sensor(s). Inserting time-series data...\n`);

  const [primary, secondary] = sensors;

  await seedSensor(primary.id, `${primary.monitoringPoint.name} (${primary.model})`);

  if (secondary) {
    await seedSensor(secondary.id, `${secondary.monitoringPoint.name} (${secondary.model})`);
  }

  console.log('\nTime-series seed completed successfully.');
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
