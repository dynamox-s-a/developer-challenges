import { PrismaClient, MachineType, SensorModel } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUser() {
  const email = process.env.SEED_USER_EMAIL;
  const password = process.env.SEED_USER_PASSWORD;
  
  if (!email || !password) {
    throw new Error('SEED_USER_EMAIL and SEED_USER_PASSWORD are required');
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  
  if (existingUser) {
    console.log(`User already exists: ${existingUser.email}, skipping seed.`);
    return existingUser;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  console.log(`User seeded: ${user.email}`);
  return user;
}

async function seedMachines() {
  const existingCount = await prisma.machine.count();
  
  if (existingCount > 0) {
    console.log(`Machines already exist (${existingCount}), skipping seed.`);
    return;
  }

  const machines = [
    { name: 'Bomba Hidráulica 01', type: MachineType.Pump },
    { name: 'Bomba Hidráulica 02', type: MachineType.Pump },
    { name: 'Bomba de Vácuo', type: MachineType.Pump },
    { name: 'Ventilador Industrial 01', type: MachineType.Fan },
    { name: 'Ventilador Industrial 02', type: MachineType.Fan },
    { name: 'Exaustor Principal', type: MachineType.Fan },
  ];

  for (const machine of machines) {
    const created = await prisma.machine.create({ data: machine });
    console.log(`Machine seeded: ${created.name} (${created.type})`);
  }
}

async function seedMonitoringPointsAndSensors() {
  const machines = await prisma.machine.findMany();

  for (const machine of machines) {
    const mpCount = await prisma.monitoringPoint.count({ where: { machineId: machine.id } });
    
    if (mpCount > 0) {
      console.log(`Monitoring Points already exist for ${machine.name}, skipping.`);
      continue;
    }

    // Create 2 monitoring points for each machine
    const mp1 = await prisma.monitoringPoint.create({
      data: { name: 'Ponto de Monitoramento 1', machineId: machine.id }
    });
    const mp2 = await prisma.monitoringPoint.create({
      data: { name: 'Ponto de Monitoramento 2', machineId: machine.id }
    });
    console.log(`Monitoring Points seeded for ${machine.name}`);

    // Create Sensors based on machine type
    if (machine.type === MachineType.Pump) {
      // Pump only accepts HF+
      await prisma.sensor.create({
        data: { model: SensorModel.HFPlus, monitoringPointId: mp1.id }
      });
      console.log(`Sensor HF+ seeded for ${mp1.name} (Pump)`);
    } else {
      // Fan accepts TcAg, TcAs, HF+
      // Let's distribute them
      await prisma.sensor.create({
        data: { model: SensorModel.TcAg, monitoringPointId: mp1.id }
      });
      console.log(`Sensor TcAg seeded for ${mp1.name} (Fan)`);

      await prisma.sensor.create({
        data: { model: SensorModel.TcAs, monitoringPointId: mp2.id }
      });
      console.log(`Sensor TcAs seeded for ${mp2.name} (Fan)`);
    }
  }
}

async function seedTimeSeries() {
  const sensors = await prisma.sensor.findMany();
  
  if (sensors.length === 0) {
    console.log('No sensors found to seed time series.');
    return;
  }

  for (const sensor of sensors) {
    const count = await prisma.timeSeries.count({ where: { sensorId: sensor.id } });
    
    if (count > 0) {
      console.log(`Time series data already exists for sensor ${sensor.id}, skipping.`);
      continue;
    }

    const dataPoints: { sensorId: string; value: number; timestamp: Date }[] = [];
    const now = new Date();

    let baseValue = 50;
    for (let i = 0; i < 50; i++) {
      const noise = (Math.random() - 0.5) * 10; // +/- 5
      const value = Math.max(0, Math.min(100, baseValue + noise));
      
      dataPoints.push({
        sensorId: sensor.id,
        value: parseFloat(value.toFixed(2)),
        timestamp: new Date(now.getTime() - (49 - i) * 60000) 
      });
      
      baseValue += (Math.random() - 0.5) * 2;
    }

    await prisma.timeSeries.createMany({ data: dataPoints });
    console.log(`Seeded 50 time series points for sensor ${sensor.id}`);
  }
}

async function main() {
  await seedUser();
  await seedMachines();
  await seedMonitoringPointsAndSensors();
  await seedTimeSeries();
  console.log('Seed concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
