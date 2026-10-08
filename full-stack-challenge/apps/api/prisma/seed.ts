import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env['DATABASE_URL'] }),
});

const READINGS_PER_SENSOR = 288; // 24h at 5-minute intervals
const READING_INTERVAL_MS = 5 * 60 * 1000;

// Deterministic PRNG so every seed run produces the same series.
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Baseline + daily oscillation + slow upward drift + noise, rounded to 3 decimals.
function syntheticSeries(sensorId: string, baseline: number, seed: number) {
  const random = mulberry32(seed);
  const start = Date.now() - READINGS_PER_SENSOR * READING_INTERVAL_MS;

  return Array.from({ length: READINGS_PER_SENSOR }, (_, i) => {
    const oscillation =
      Math.sin((2 * Math.PI * i) / READINGS_PER_SENSOR) * baseline * 0.2;
    const drift = (i / READINGS_PER_SENSOR) * baseline * 0.15;
    const noise = (random() - 0.5) * baseline * 0.1;
    return {
      sensorId,
      timestamp: new Date(start + i * READING_INTERVAL_MS),
      value: Math.round((baseline + oscillation + drift + noise) * 1000) / 1000,
    };
  });
}

async function main() {
  // Cascades to monitoring points, sensors and readings.
  await prisma.machine.deleteMany();

  // Pumps only accept HF+ sensors; fans accept any model.
  const pump = await prisma.machine.create({
    data: {
      name: 'Bomba Centrífuga 01',
      type: 'Pump',
      monitoringPoints: {
        create: [
          {
            name: 'Mancal Dianteiro',
            sensor: { create: { serialNumber: 'HFP-0001', model: 'HFPlus' } },
          },
          {
            name: 'Mancal Traseiro',
            sensor: { create: { serialNumber: 'HFP-0002', model: 'HFPlus' } },
          },
          { name: 'Carcaça' },
        ],
      },
    },
    include: { monitoringPoints: { include: { sensor: true } } },
  });

  const fan = await prisma.machine.create({
    data: {
      name: 'Ventilador Exaustor 02',
      type: 'Fan',
      monitoringPoints: {
        create: [
          {
            name: 'Motor Lado Acoplado',
            sensor: { create: { serialNumber: 'TCAG-0001', model: 'TcAg' } },
          },
          {
            name: 'Motor Lado Oposto',
            sensor: { create: { serialNumber: 'TCAS-0001', model: 'TcAs' } },
          },
          {
            name: 'Rotor',
            sensor: { create: { serialNumber: 'HFP-0003', model: 'HFPlus' } },
          },
        ],
      },
    },
    include: { monitoringPoints: { include: { sensor: true } } },
  });

  const sensors = [...pump.monitoringPoints, ...fan.monitoringPoints].flatMap(
    (point) => (point.sensor ? [point.sensor] : []),
  );

  const readings = sensors.flatMap((sensor, index) =>
    syntheticSeries(sensor.id, 2 + index * 0.5, index + 1),
  );
  await prisma.reading.createMany({ data: readings });

  console.log(
    `Seeded 2 machines, ${pump.monitoringPoints.length + fan.monitoringPoints.length} monitoring points, ` +
      `${sensors.length} sensors and ${readings.length} readings.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
