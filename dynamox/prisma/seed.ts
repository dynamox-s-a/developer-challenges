import { PrismaClient, MachineType, SensorModel } from "@prisma/client";

const prisma = new PrismaClient();
const MACHINE_COUNT = 20;

const getRandomMachineType = (): MachineType =>
  Math.random() < 0.5 ? MachineType.Pump : MachineType.Fan;

const getRandomSensorModel = (machineType: MachineType): SensorModel => {
  const validModels =
    machineType === MachineType.Pump
      ? [SensorModel.HF_plus]
      : [SensorModel.TcAg, SensorModel.TcAs, SensorModel.HF_plus];

  return validModels[Math.floor(Math.random() * validModels.length)];
};

async function seedUser() {
  const admin = await prisma.admin.create({
    data: {
      email: "admin@example.com",
      password: "admin123456",
    },
  });
  console.log(`Admin created: ${admin.email}`);
}

async function createMachinesWithMonitoringPoints() {
  for (let i = 1; i <= MACHINE_COUNT; i++) {
    const machineType = getRandomMachineType();
    const machine = await prisma.machine.create({
      data: {
        name: `Machine ${i}`,
        type: machineType,
      },
    });

    console.log(`Created machine: ${machine.name} (${machine.type})`);

    const monitoringPointCount = Math.random() < 0.5 ? 2 : 3;
    for (let j = 1; j <= monitoringPointCount; j++) {
      const monitoringPoint = await prisma.monitoringPoint.create({
        data: {
          name: `Monitoring Point ${j} for ${machine.name}`,
          machineId: machine.id,
        },
      });

      console.log(`  -> Created monitoring point: ${monitoringPoint.name}`);

      const sensorModel = getRandomSensorModel(machine.type);
      await prisma.sensor.create({
        data: {
          SensorId: `SENSOR-${i}-${j}-${Date.now()}`,
          model: sensorModel,
          monitoringPointId: monitoringPoint.id,
        },
      });

      console.log(`    -> Added sensor model: ${sensorModel}`);
    }
  }
}

async function main() {
  console.log("Seeding database...");
  await seedUser();
  await createMachinesWithMonitoringPoints();
  console.log("Seeding completed successfully!");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("Error seeding database:", e);
  await prisma.$disconnect();
  process.exit(1);
});
