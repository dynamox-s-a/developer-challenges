import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const machines = [
    { name: "Pump 1", type: "Pump" },
    { name: "Fan 1", type: "Fan" },
    { name: "Fan 2", type: "Fan" },
  ];

  const sensors = ["TcAg", "TcAs", "HF_plus"];

  for (const machineData of machines) {
    // Create a machine
    const machine = await prisma.machine.create({
      data: {
        name: machineData.name,
        type: machineData.type as any,
      },
    });

    // Add at least 2 monitoring points for each machine
    const monitoringPoints = await Promise.all(
      Array.from({ length: 2 }).map((_, i) =>
        prisma.monitoringPoint.create({
          data: {
            name: `Monitoring Point ${i + 1} for ${machine.name}`,
            machineId: machine.id,
          },
        })
      )
    );

    // For each monitoring point, add a sensor
    for (const point of monitoringPoints) {
      const validSensors = machineData.type === "Pump" ? ["HF_plus"] : sensors; // Only "HF_plus" allowed for Pumps

      const sensorModel =
        validSensors[Math.floor(Math.random() * validSensors.length)];

      await prisma.sensor.create({
        data: {
          model: sensorModel as any,
          monitoringPointId: point.id,
        },
      });
    }
  }
}

main()
  .then(async () => {
    console.log("Seeding completed.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
