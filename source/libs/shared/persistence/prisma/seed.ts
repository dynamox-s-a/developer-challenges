import 'dotenv/config';
import { PrismaClient } from './generated/main/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ 
  connectionString: process.env['DATABASE_URL'] 
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seeding...');

  // 1. Clean up existing data (optional, be careful in prod)
  // await prisma.telemetry.deleteMany();
  // await prisma.sensor.deleteMany();
  // await prisma.monitoringPoint.deleteMany();
  // await prisma.machine.deleteMany();
  // await prisma.user.deleteMany();

  // 2. Create Default User
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash('admin1234', salt);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@dynamox.com' },
    update: {},
    create: {
      email: 'admin@dynamox.com',
      password,
    },
  });
  console.log(`👤 Created user: ${user.email}`);

  // 3. Create Machines
  const machine1 = await prisma.machine.create({
    data: {
      name: 'Pump 01',
      type: 'Pump',
      monitoringPoints: {
        create: [
          { name: 'Motor Drive End' }, // Valid for HF+
          { name: 'Motor Non-Drive End' },
        ]
      }
    },
    include: { monitoringPoints: true }
  });
  console.log(`⚙️ Created machine: ${machine1.name} (${machine1.type})`);

  const machine2 = await prisma.machine.create({
    data: {
      name: 'Fan 01',
      type: 'Fan',
      monitoringPoints: {
        create: [
          { name: 'Fan Bearing 1' },
          { name: 'Fan Bearing 2' },
        ]
      }
    },
    include: { monitoringPoints: true }
  });
  console.log(`⚙️ Created machine: ${machine2.name} (${machine2.type})`);

  // 4. Associate Sensors
  // Machine 1 (Pump) - Can ONLY use HF+ (Business Rule: Pump != TcAg/TcAs)
  if (machine1.monitoringPoints[0]) {
    await prisma.sensor.upsert({
      where: { id: 'sensor_hf_01' },
      update: {},
      create: {
        id: 'sensor_hf_01',
        model: 'HF_Plus',
        monitoringPointId: machine1.monitoringPoints[0].id
      }
    });
    console.log(`  └─ Associated Sensor HF+ to ${machine1.monitoringPoints[0].name}`);
  }

  // Machine 2 (Fan) - Can use any
  if (machine2.monitoringPoints[0]) {
    await prisma.sensor.upsert({
      where: { id: 'sensor_tcag_01' },
      update: {},
      create: {
        id: 'sensor_tcag_01',
        model: 'TcAg',
        monitoringPointId: machine2.monitoringPoints[0].id
      }
    });
    console.log(`  └─ Associated Sensor TcAg to ${machine2.monitoringPoints[0].name}`);
  }

  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
