import { prisma } from './libs/shared/persistence/src/index';

async function test() {
  try {
    const total = await prisma.telemetry.count();
    console.log('Total Telemetry:', total);
    if (total > 0) {
      const sample = await prisma.telemetry.findFirst();
      console.log('Sample Record:', sample);
    }
    
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    console.log('15 mins ago:', fifteenMinutesAgo);
    
    const countRecent = await prisma.telemetry.count({
      where: {
        timestamp: {
          gte: fifteenMinutesAgo
        }
      }
    });
    console.log('Recent Telemetry Count:', countRecent);

    const trend = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('minute', "timestamp") AS minute,
        AVG("accelerationValue") AS "avgAcceleration",
        AVG("velocityValue") AS "avgVelocity",
        AVG("temperatureValue") AS "avgTemperature"
      FROM "telemetry"
      WHERE "timestamp" >= ${fifteenMinutesAgo}
      GROUP BY DATE_TRUNC('minute', "timestamp")
      ORDER BY minute ASC
    `;
    console.log('Trend Data:', trend);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
