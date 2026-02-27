import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });
import { PrismaClient } from '../src/prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@dynapredict.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@dynapredict.com',
      password: adminHash,
      role: 'SUPER_ADMIN',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'demo@dynapredict.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@dynapredict.com',
      password: userHash,
      role: 'USER',
    },
  });

  // Machines for admin
  const [pump1, pump2, fan1] = await prisma.$transaction([
    prisma.machine.create({ data: { name: 'Bomba Principal', type: 'Pump', userId: admin.id } }),
    prisma.machine.create({ data: { name: 'Bomba Secundária', type: 'Pump', userId: admin.id } }),
    prisma.machine.create({ data: { name: 'Ventilador Industrial', type: 'Fan', userId: admin.id } }),
  ]);

  // Monitoring points
  const [mp1, mp2, mp3, mp4, mp5, mp6, mp7, mp8, mp9, mp10, mp11] = await prisma.$transaction([
    prisma.monitoringPoint.create({ data: { name: 'Ponto A - Entrada', machineId: pump1.id } }),
    prisma.monitoringPoint.create({ data: { name: 'Ponto B - Saída', machineId: pump1.id } }),
    prisma.monitoringPoint.create({ data: { name: 'Ponto C - Rolamento', machineId: pump1.id } }),
    prisma.monitoringPoint.create({ data: { name: 'Ponto D - Eixo', machineId: pump1.id } }),
    prisma.monitoringPoint.create({ data: { name: 'Ponto E - Mancal Dianteiro', machineId: pump2.id } }),
    prisma.monitoringPoint.create({ data: { name: 'Ponto F - Mancal Traseiro', machineId: pump2.id } }),
    prisma.monitoringPoint.create({ data: { name: 'Ponto G - Carcaça', machineId: pump2.id } }),
    prisma.monitoringPoint.create({ data: { name: 'Ponto H - Motor', machineId: fan1.id } }),
    prisma.monitoringPoint.create({ data: { name: 'Ponto I - Pá', machineId: fan1.id } }),
    prisma.monitoringPoint.create({ data: { name: 'Ponto J - Redutor', machineId: fan1.id } }),
    prisma.monitoringPoint.create({ data: { name: 'Ponto K - Vibração', machineId: fan1.id } }),
    prisma.monitoringPoint.create({ data: { name: 'Ponto L - Sem Sensor', machineId: fan1.id } }),
  ]);

  // NOTE (@eric-reis): Sensors (Pump → HFPlus only | Fan → TcAg/TcAs only)
  await prisma.$transaction([
    prisma.sensor.create({ data: { model: 'HFPlus', monitoringPointId: mp1.id } }),
    prisma.sensor.create({ data: { model: 'HFPlus', monitoringPointId: mp2.id } }),
    prisma.sensor.create({ data: { model: 'HFPlus', monitoringPointId: mp3.id } }),
    prisma.sensor.create({ data: { model: 'HFPlus', monitoringPointId: mp4.id } }),
    prisma.sensor.create({ data: { model: 'HFPlus', monitoringPointId: mp5.id } }),
    prisma.sensor.create({ data: { model: 'HFPlus', monitoringPointId: mp6.id } }),
    prisma.sensor.create({ data: { model: 'HFPlus', monitoringPointId: mp7.id } }),
    prisma.sensor.create({ data: { model: 'TcAg', monitoringPointId: mp8.id } }),
    prisma.sensor.create({ data: { model: 'TcAs', monitoringPointId: mp9.id } }),
    prisma.sensor.create({ data: { model: 'TcAg', monitoringPointId: mp10.id } }),
    prisma.sensor.create({ data: { model: 'TcAs', monitoringPointId: mp11.id } }),
  ]);

  console.log('Seed completed successfully');
  console.log(`  Users:             admin (${admin.email}), user (${user.email})`);
  console.log(`  Machines:          ${pump1.name}, ${pump2.name}, ${fan1.name}`);
  console.log(`  Monitoring points: 12 points across 3 machines`);
  console.log(`  Sensors:           11 sensors assigned, 1 unassigned`);
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
