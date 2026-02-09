import { MachineType, PrismaClient, SensorModel } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

console.log("Starting seed");
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be valid!");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {

    await prisma.sensorData.deleteMany();
    await prisma.sensor.deleteMany();
    await prisma.monitoringPoint.deleteMany();
    await prisma.machine.deleteMany();

    const admin = await prisma.user.upsert({
        where: { email: "admin@dynamox.com" },
        update: {},
        create: {
            id: "123",
            name: "Admin",
            email: "admin@dynamox.com",
            password: "123456"
        }
    });

    await prisma.machine.create({
        data: {
            name: "Bomba de Recalque 01",
            type: MachineType.PUMP,
            userId: admin.id,
            points: {
                create: {
                    name: "Ponto A1",
                    sensor: {
                        create: {
                            sensorUid: "SN-BOMBA-01",
                            model: SensorModel.HF_PLUS,
                            data: {
                                create: Array.from({ length: 10 }).map((_, i) => ({
                                    temp: Number((Math.random() * 50 + 20).toFixed(2)),
                                    vibration: Number((Math.random() * 10).toFixed(2)),
                                    timestamp: new Date(Date.now() - i * 3600000)
                                }))
                            }
                        }
                    }
                }
            }
        }
    });

    await prisma.machine.create({
        data: {
            name: "Exaustor de Ar 02",
            type: MachineType.FAN,
            userId: admin.id,
            points: {
                create: {
                    name: "Mancal Frontal",
                    sensor: {
                        create: {
                            sensorUid: "SN-FAN-02",
                            model: SensorModel.TCAG,
                            data: {
                                create: Array.from({ length: 10 }).map((_, i) => ({
                                    temp: Number((Math.random() * 50 + 20).toFixed(2)),
                                    vibration: Number((Math.random() * 10).toFixed(2)),
                                    timestamp: new Date(Date.now() - i * 3600000)
                                }))
                            }
                        }
                    }
                }
            }
        }
    });

    console.log("Seed finalizado com sucesso!");
}
main();