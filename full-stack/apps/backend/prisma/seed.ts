import "dotenv/config.js";
import { faker } from "@faker-js/faker";
import PrismaPkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const { PrismaClient } = PrismaPkg;

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set. Create apps/backend/.env");

const pool = new Pool({ connectionString: url });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const sensorModelsAll = ["TcAg", "TcAs", "HF_plus"] as const;
const sensorModelsForPump = ["HF_plus"] as const;

function pickSensorModel(machineType: "Pump" | "Fan") {
  if (machineType === "Pump") return faker.helpers.arrayElement(sensorModelsForPump);
  return faker.helpers.arrayElement(sensorModelsAll);
}

async function main() {
  // Seed idempotente: limpar primeiro
  await prisma.sensor.deleteMany();
  await prisma.monitoringPoint.deleteMany();
  await prisma.machine.deleteMany();

  const adminUsername = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { username: adminUsername },
    update: { passwordHash, role: "admin" },
    create: { username: adminUsername, passwordHash, role: "admin" },
  });

  const machinesCount = 12;

  for (let i = 0; i < machinesCount; i++) {
    const type = faker.helpers.arrayElement(["Pump", "Fan"] as const);
    const machine = await prisma.machine.create({
      data: {
        name: `${type} ${faker.company.name().slice(0, 18)} ${i + 1}`,
        type,
      },
    });

    const monitoringPointsCount = faker.number.int({ min: 2, max: 5 });

    for (let j = 0; j < monitoringPointsCount; j++) {
      const model = pickSensorModel(type);

      // uniqueId está UNIQUE no schema, então garantimos unicidade
      const uniqueId = `S-${faker.string.alphanumeric({ length: 10 }).toUpperCase()}-${i}${j}`;

      await prisma.monitoringPoint.create({
        data: {
          name: `MP ${j + 1} - ${faker.hacker.noun()}`.slice(0, 60),
          machineId: machine.id,
          sensor: {
            create: {
              uniqueId,
              model,
            },
          },
        },
      });
    }
  }

  const totalMachines = await prisma.machine.count();
  const totalMPs = await prisma.monitoringPoint.count();
  const totalSensors = await prisma.sensor.count();

  console.log("Seed completed:", { totalMachines, totalMPs, totalSensors });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });