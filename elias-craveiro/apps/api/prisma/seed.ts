// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import bcrypt from 'bcryptjs';
import {client as prisma} from './client';

const SEED_EMAIL = 'admin@dynamox.com';
const SEED_PASSWORD = '123456';

const MACHINES_TOTAL = 30;        // 30 machines
const MPS_PER_MACHINE = 4;        // 4 MPs por machine => 120 MPs
const SENSORS_PERCENT = 0.8;      // 80% MPs com sensor
const POINTS_PER_MP = 600;        // 600 pontos por MP => 72k pontos
const CREATE_MANY_BATCH = 10000;  // batch pra createMany (safe)

enum MachineType {
    Pump = 'Pump',
    Fan = 'Fan',
}

enum SensorModel {
    HF_PLUS = 'HF_PLUS',
    TcAg = 'TcAg',
    TcAs = 'TcAs',
}

function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
    return arr[randInt(0, arr.length - 1)];
}

function pad(n: number, len = 3) {
    return String(n).padStart(len, '0');
}

function nowMinusSeconds(seconds: number) {
    return new Date(Date.now() - seconds * 1000);
}

async function main() {
    console.log('🌱 Seeding...');

    // 1) user
    const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

    const user = await prisma.user.upsert({
        where: { email: SEED_EMAIL },
        update: {},
        create: { email: SEED_EMAIL, passwordHash },
        select: { id: true, email: true },
    });

    console.log('✅ user:', user);

    // 2) limpar dados antigos do user (opcional, mas recomendado pra re-seed)
    // ordem respeitando FKs
    await prisma.timeSeriesPoint.deleteMany({
        where: { monitoringPoint: { machine: { userId: user.id } } },
    });
    await prisma.sensor.deleteMany({
        where: { monitoringPoint: { machine: { userId: user.id } } },
    });
    await prisma.monitoringPoint.deleteMany({
        where: { machine: { userId: user.id } },
    });
    await prisma.machine.deleteMany({ where: { userId: user.id } });

    console.log('🧹 cleared old data for user');

    // 3) criar machines
    const machinesData = Array.from({ length: MACHINES_TOTAL }, (_, i) => {
        const type: MachineType = i % 2 === 0 ? MachineType.Pump : MachineType.Fan;
        return {
            userId: user.id,
            name: `${type}-Machine-${pad(i + 1, 2)}`,
            type,
        };
    });

    // createMany não retorna IDs, então cria e busca de volta.
    await prisma.machine.createMany({ data: machinesData });
    const machines = await prisma.machine.findMany({
        where: { userId: user.id },
        select: { id: true, type: true, name: true },
        orderBy: { id: 'asc' },
    });

    console.log(`✅ machines: ${machines.length}`);

    // 4) criar MPs
    const mpData: { machineId: number; name: string }[] = [];
    for (const m of machines) {
        for (let j = 0; j < MPS_PER_MACHINE; j++) {
            mpData.push({
                machineId: m.id,
                name: `MP-${pad(j + 1, 2)}@${m.name}`,
            });
        }
    }

    await prisma.monitoringPoint.createMany({ data: mpData });
    const mps = await prisma.monitoringPoint.findMany({
        where: { machine: { userId: user.id } },
        select: {
            id: true,
            machineId: true,
            name: true,
            machine: { select: { type: true } },
        },
        orderBy: { id: 'asc' },
    });

    console.log(`✅ monitoring points: ${mps.length}`);

    // 5) criar Sensors respeitando regra Pump:
    // - se Pump: só HF_PLUS
    // - se Fan: TcAg/TcAs/HF_PLUS
    const sensorsToCreate: {
        uid: string;
        model: SensorModel;
        monitoringPointId: number;
    }[] = [];
    let uidCounter = 1;

    for (const mp of mps) {
        if (Math.random() > SENSORS_PERCENT) continue;

        const allowedModels: SensorModel[] =
            mp.machine.type === MachineType.Pump
                ? [SensorModel.HF_PLUS]
                : [SensorModel.HF_PLUS, SensorModel.TcAg, SensorModel.TcAs];

        sensorsToCreate.push({
            uid: `SENS-${pad(uidCounter++, 5)}`,
            model: pick(allowedModels),
            monitoringPointId: mp.id,
        });
    }

    await prisma.sensor.createMany({
        data: sensorsToCreate,
        skipDuplicates: true,
    });
    console.log(`✅ sensors: ${sensorsToCreate.length}`);

    // 6) Time-series: criar muitos pontos em lote
    // Estratégia:
    // - pra cada MP, gerar POINTS_PER_MP pontos 1s apart no passado
    // - inserir via createMany em batches globais (CREATE_MANY_BATCH)
    let buffer: {
        monitoringPointId: number;
        timestamp: Date;
        value: number;
    }[] = [];
    let totalPoints = 0;

    for (let mpIndex = 0; mpIndex < mps.length; mpIndex++) {
        const mp = mps[mpIndex];

        const base = randInt(10, 100);
        const startSecondsAgo = POINTS_PER_MP + randInt(0, 200);

        for (let i = 0; i < POINTS_PER_MP; i++) {
            const t = nowMinusSeconds(startSecondsAgo - i); // crescente no tempo
            const value =
                base + Math.sin(i / 12) * 3 + (Math.random() - 0.5) * 1.2;

            buffer.push({
                monitoringPointId: mp.id,
                timestamp: t,
                value: Number(value.toFixed(3)),
            });

            if (buffer.length >= CREATE_MANY_BATCH) {
                const batch = buffer;
                buffer = [];
                await prisma.timeSeriesPoint.createMany({ data: batch });
                totalPoints += batch.length;
                process.stdout.write(`📈 inserted points: ${totalPoints}\r`);
            }
        }
    }

    // flush final
    if (buffer.length) {
        await prisma.timeSeriesPoint.createMany({ data: buffer });
        totalPoints += buffer.length;
    }

    console.log(`\n✅ time-series points inserted: ${totalPoints}`);

    // sanity checks
    const mpCount = await prisma.monitoringPoint.count({
        where: { machine: { userId: user.id } },
    });
    const pointCount = await prisma.timeSeriesPoint.count({
        where: { monitoringPoint: { machine: { userId: user.id } } },
    });

    console.log('📊 sanity:', { mpCount, pointCount });
    console.log('🌱 Done.');
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
