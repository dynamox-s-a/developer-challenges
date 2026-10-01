import { PrismaService } from '../prisma/prisma.service';
import { seedUser } from '../seed/seed-user';
import { resetDatabase } from '../../test/reset-database';

/** A promise with its resolver exposed, to hold a transaction open until the test says so. */
function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => (resolve = done));
  return { promise, resolve };
}

/** Whether a promise is still waiting after a short while: here, blocked on a row lock. */
async function isBlocked(promise: Promise<unknown>, ms = 500): Promise<boolean> {
  const timeout = new Promise<'blocked'>((done) => setTimeout(() => done('blocked'), ms));
  return (
    (await Promise.race([
      promise.then(
        () => 'settled',
        () => 'settled',
      ),
      timeout,
    ])) === 'blocked'
  );
}

/** The sensors table enforces its rules even when the application does not. */
describe('sensors table', () => {
  // Two clients with their own connections, to run two transactions at the same time.
  const prisma = new PrismaService();
  const other = new PrismaService();
  let fan: string;
  let fanPoint: string;
  let pumpPoint: string;

  beforeEach(async () => {
    await resetDatabase(prisma);
    const { userId } = await seedUser(prisma, {
      email: 'operator@plant.test',
      password: 'correct horse battery',
    });
    const sector = await prisma.sector.create({
      data: { ownerId: userId, code: 'DRY', name: 'Drying' },
    });
    const pump = await prisma.machine.create({
      data: { sectorId: sector.id, type: 'PUMP', number: 1, name: 'Condensate pump' },
    });
    const fanMachine = await prisma.machine.create({
      data: { sectorId: sector.id, type: 'FAN', number: 2, name: 'Hood exhaust fan' },
    });
    fan = fanMachine.id;
    pumpPoint = (
      await prisma.monitoringPoint.create({
        data: { machineId: pump.id, machineType: 'PUMP', location: 'PUMP_MOTOR_DE', name: 'Motor' },
      })
    ).id;
    // OTHER fits both types, so only the sensor model can block a type change here.
    fanPoint = (
      await prisma.monitoringPoint.create({
        data: { machineId: fan, machineType: 'FAN', location: 'OTHER', name: 'Casing' },
      })
    ).id;
  });

  afterAll(async () => {
    await Promise.all([prisma.$disconnect(), other.$disconnect()]);
  });

  function insert(
    client: PrismaService,
    pointId: string,
    machineType: string,
    model: string,
    serial = `DX-${Math.floor(Math.random() * 1e6)}`,
  ) {
    return client.$executeRaw`
      INSERT INTO sensors (monitoring_point_id, machine_type, serial_number, model, updated_at)
      VALUES (${pointId}::uuid, ${machineType}::machine_type, ${serial}, ${model}::sensor_model, now())`;
  }

  it('accepts HF+ on a pump and every model on a fan', async () => {
    await insert(prisma, pumpPoint, 'PUMP', 'HF_PLUS');
    await insert(prisma, fanPoint, 'FAN', 'TC_AG');

    expect(await prisma.sensor.count()).toBe(2);
  });

  it('rejects TcAg and TcAs on a pump (B15)', async () => {
    for (const model of ['TC_AG', 'TC_AS']) {
      await expect(insert(prisma, pumpPoint, 'PUMP', model)).rejects.toThrow(
        /sensors_pump_model_check/,
      );
    }
  });

  it('rejects a type copy that differs from the point type', async () => {
    await expect(insert(prisma, pumpPoint, 'FAN', 'TC_AG')).rejects.toThrow(
      /sensors_monitoring_point_id_machine_type_fkey/,
    );
  });

  it('allows one sensor per point and one point per serial number', async () => {
    await insert(prisma, fanPoint, 'FAN', 'TC_AG', 'DX-0001');

    await expect(insert(prisma, fanPoint, 'FAN', 'TC_AS', 'DX-0002')).rejects.toThrow(
      /sensors_monitoring_point_id_key/,
    );
    await expect(insert(prisma, pumpPoint, 'PUMP', 'HF_PLUS', 'DX-0001')).rejects.toThrow(
      /sensors_serial_number_key/,
    );
  });

  it('accepts serials of 3 and 40 characters and rejects 2, 41, lowercase or spaces', async () => {
    await insert(prisma, fanPoint, 'FAN', 'TC_AG', 'DX1');
    await insert(prisma, pumpPoint, 'PUMP', 'HF_PLUS', 'D'.repeat(40));

    for (const serial of ['DX', 'D'.repeat(41), 'dx-0001', 'DX 0001']) {
      await expect(insert(prisma, fanPoint, 'FAN', 'TC_AG', serial)).rejects.toThrow(
        /sensors_serial_number_format_check/,
      );
    }
  });

  it('refuses to turn a fan into a pump while it holds a TcAg sensor (B5)', async () => {
    await insert(prisma, fanPoint, 'FAN', 'TC_AG');

    await expect(
      prisma.machine.update({ where: { id: fan }, data: { type: 'PUMP' } }),
    ).rejects.toThrow(/sensors_pump_model_check/);
    expect((await prisma.machine.findUniqueOrThrow({ where: { id: fan } })).type).toBe('FAN');
  });

  it('removes the sensor with its point, and the point with its machine (B6)', async () => {
    await insert(prisma, fanPoint, 'FAN', 'TC_AG');

    await prisma.machine.delete({ where: { id: fan } });

    expect(await prisma.sensor.count()).toBe(0);
  });

  describe('two transactions at the same time (domain model, "Rules that span tables")', () => {
    it('type change first: the TcAg insert waits for it, then is refused', async () => {
      const changed = deferred();
      const release = deferred();
      const typeChange = prisma.$transaction(
        async (tx) => {
          await tx.machine.update({ where: { id: fan }, data: { type: 'PUMP' } });
          changed.resolve();
          await release.promise;
        },
        { timeout: 15000 },
      );
      await changed.promise;

      const sensor = insert(other, fanPoint, 'FAN', 'TC_AG');

      expect(await isBlocked(sensor)).toBe(true);
      release.resolve();
      await typeChange;
      await expect(sensor).rejects.toThrow(/sensors_monitoring_point_id_machine_type_fkey/);
      expect(await prisma.sensor.count()).toBe(0);
      expect((await prisma.machine.findUniqueOrThrow({ where: { id: fan } })).type).toBe('PUMP');
    });

    it('TcAg insert first: the type change waits for it, then is refused', async () => {
      const inserted = deferred();
      const release = deferred();
      const sensor = prisma.$transaction(
        async (tx) => {
          await insert(tx as unknown as PrismaService, fanPoint, 'FAN', 'TC_AG');
          inserted.resolve();
          await release.promise;
        },
        { timeout: 15000 },
      );
      await inserted.promise;

      const typeChange = other.machine.update({ where: { id: fan }, data: { type: 'PUMP' } });

      expect(await isBlocked(typeChange)).toBe(true);
      release.resolve();
      await sensor;
      await expect(typeChange).rejects.toThrow(/sensors_pump_model_check/);
      expect((await prisma.machine.findUniqueOrThrow({ where: { id: fan } })).type).toBe('FAN');
      expect(await prisma.sensor.count({ where: { model: 'TC_AG' } })).toBe(1);
    });
  });
});
