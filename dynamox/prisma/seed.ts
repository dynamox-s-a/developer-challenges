import { PrismaClient, SensorModel, MachineType } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  await prisma.admin.create({
    data: {
      id: "admin1",
      username: "admin1",
    },
  });

  // MACHINES
  const machines = [
    { name: "Machine A", type: MachineType.Pump },
    { name: "Machine B", type: MachineType.Fan },
  ];

  for (const machine of machines) {
    await prisma.machine.create({ data: machine });
  }

  // SENSORS
  const sensors = [
    { id: "sensor1", name: "Sensor 1", model: SensorModel.TcAg, machineId: 1 },
    {
      id: "sensor2",
      name: "Sensor 2",
      model: SensorModel.HF_PLUS,
      machineId: 2,
    },
  ];

  for (const sensor of sensors) {
    await prisma.sensor.create({ data: sensor });
  }

  // MONITORING POINTS
  const monitoringPoints = [
    { name: "Point 1", sensorId: "sensor1", machineId: 1 },
    { name: "Point 2", sensorId: "sensor2", machineId: 2 },
  ];

  for (const point of monitoringPoints) {
    await prisma.monitoringPoint.create({ data: point });
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
