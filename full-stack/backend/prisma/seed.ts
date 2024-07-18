import { MachineType, PrismaClient, SensorModel } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seed...');

  const hashedPassword = bcrypt.hashSync('pass123', 8);

  await prisma.user.createMany({
    data: [
      {
        email: 'user1@example.com',
        password: hashedPassword,
      },
      {
        email: 'user2@example.com',
        password: hashedPassword,
      },
    ],
  });

  const users = await prisma.user.findMany();

  await prisma.machine.createMany({
    data: [
      {
        name: 'Machine1',
        type: MachineType.Fan,
        userId: users[0].id,
      },
      {
        name: 'Machine2',
        type: MachineType.Fan,
        userId: users[0].id,
      },
      {
        name: 'Machine3',
        type: MachineType.Pump,
        userId: users[0].id,
      },
      {
        name: 'Machine4',
        type: MachineType.Pump,
        userId: users[0].id,
      },
      {
        name: 'Machine5',
        type: MachineType.Fan,
        userId: users[1].id,
      },
      {
        name: 'Machine6',
        type: MachineType.Fan,
        userId: users[1].id,
      },
      {
        name: 'Machine7',
        type: MachineType.Pump,
        userId: users[1].id,
      },
      {
        name: 'Machine8',
        type: MachineType.Pump,
        userId: users[1].id,
      },
    ],
  });

  const machines = await prisma.machine.findMany();

  await prisma.monitoringPoint.createMany({
    data: [
      {
        name: 'Monitoring 1',
        machineId: machines[0].id,
      },
      {
        name: 'Monitoring 2',
        machineId: machines[1].id,
      },
      {
        name: 'Monitoring 3',
        machineId: machines[2].id,
      },
      {
        name: 'Monitoring 4',
        machineId: machines[3].id,
      },
      {
        name: 'Monitoring 5',
        machineId: machines[4].id,
      },
      {
        name: 'Monitoring 6',
        machineId: machines[5].id,
      },
      {
        name: 'Monitoring 7',
        machineId: machines[6].id,
      },
      {
        name: 'Monitoring 8',
        machineId: machines[7].id,
      },
    ],
  });

  const monitoringPoints = await prisma.monitoringPoint.findMany();

  await prisma.sensor.createMany({
    data: [
      {
        modelName: SensorModel.TcAs,
        monitoringPointId: monitoringPoints[0].id,
      },
      {
        modelName: SensorModel.TcAg,
        monitoringPointId: monitoringPoints[1].id,
      },
      {
        modelName: SensorModel.HFPlus,
        monitoringPointId: monitoringPoints[2].id,
      },
      {
        modelName: SensorModel.HFPlus,
        monitoringPointId: monitoringPoints[3].id,
      },
      {
        modelName: SensorModel.TcAs,
        monitoringPointId: monitoringPoints[4].id,
      },
      {
        modelName: SensorModel.TcAs,
        monitoringPointId: monitoringPoints[5].id,
      },
      {
        modelName: SensorModel.HFPlus,
        monitoringPointId: monitoringPoints[6].id,
      },
      {
        modelName: SensorModel.HFPlus,
        monitoringPointId: monitoringPoints[7].id,
      },
    ],
  });

  console.log('Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
