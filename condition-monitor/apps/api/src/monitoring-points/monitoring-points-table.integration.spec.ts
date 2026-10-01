import { PrismaService } from '../prisma/prisma.service';
import { seedUser } from '../seed/seed-user';
import { resetDatabase } from '../../test/reset-database';

/** The monitoring points table enforces its rules even when the application does not. */
describe('monitoring points table', () => {
  const prisma = new PrismaService();
  let pump: string;
  let fan: string;

  beforeEach(async () => {
    await resetDatabase(prisma);
    const { userId } = await seedUser(prisma, {
      email: 'operator@plant.test',
      password: 'correct horse battery',
    });
    const sector = await prisma.sector.create({
      data: { ownerId: userId, code: 'DRY', name: 'Drying' },
    });
    pump = (
      await prisma.machine.create({
        data: { sectorId: sector.id, type: 'PUMP', number: 1, name: 'Condensate pump' },
      })
    ).id;
    fan = (
      await prisma.machine.create({
        // Number 2, so turning it into a pump does not collide with DRY-PUMP-01's tag.
        data: { sectorId: sector.id, type: 'FAN', number: 2, name: 'Hood exhaust fan' },
      })
    ).id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function insert(machineId: string, machineType: string, location: string, name = 'Bearing') {
    return prisma.$executeRaw`
      INSERT INTO monitoring_points (machine_id, machine_type, location, name, updated_at)
      VALUES (${machineId}::uuid, ${machineType}::machine_type, ${location}::location, ${name}, now())`;
  }

  it('accepts positions of the machine type, and OTHER on both types', async () => {
    await insert(pump, 'PUMP', 'PUMP_MECHANICAL_SEAL');
    await insert(fan, 'FAN', 'FAN_SHAFT_NDE');
    await insert(pump, 'PUMP', 'OTHER');
    await insert(fan, 'FAN', 'OTHER');

    expect(await prisma.monitoringPoint.count()).toBe(4);
  });

  it('rejects a position of the other type', async () => {
    await expect(insert(pump, 'PUMP', 'FAN_SHAFT_DE')).rejects.toThrow(
      /monitoring_points_location_type_check/,
    );
    await expect(insert(fan, 'FAN', 'PUMP_IMPELLER_SIDE')).rejects.toThrow(
      /monitoring_points_location_type_check/,
    );
  });

  it('rejects a type copy that differs from the machine type', async () => {
    await expect(insert(pump, 'FAN', 'FAN_SHAFT_DE')).rejects.toThrow(
      /monitoring_points_machine_id_machine_type_fkey/,
    );
  });

  it('rejects a position twice on one machine, but lets OTHER repeat', async () => {
    await insert(pump, 'PUMP', 'PUMP_MOTOR_DE');
    await insert(pump, 'PUMP', 'OTHER', 'Casing');
    await insert(pump, 'PUMP', 'OTHER', 'Base plate');

    await expect(insert(pump, 'PUMP', 'PUMP_MOTOR_DE', 'Again')).rejects.toThrow(
      /monitoring_points_machine_location_key/,
    );
  });

  it('accepts repeated names, as the position identifies the point (B2)', async () => {
    await insert(pump, 'PUMP', 'PUMP_MOTOR_NDE', 'Motor bearing');
    await insert(pump, 'PUMP', 'PUMP_MOTOR_DE', 'Motor bearing');

    expect(await prisma.monitoringPoint.count({ where: { name: 'Motor bearing' } })).toBe(2);
  });

  it('accepts a name of 1 and 100 characters and rejects 101, empty or padded', async () => {
    await insert(pump, 'PUMP', 'OTHER', 'A');
    await insert(pump, 'PUMP', 'OTHER', 'N'.repeat(100));

    for (const name of ['N'.repeat(101), '', ' Bearing', 'Bearing ']) {
      await expect(insert(pump, 'PUMP', 'OTHER', name)).rejects.toThrow(
        /monitoring_points_name_check/,
      );
    }
  });

  it('carries a type change down, and refuses it while a position of the old type remains', async () => {
    await insert(fan, 'FAN', 'OTHER');
    await prisma.machine.update({ where: { id: fan }, data: { type: 'PUMP' } });

    const [point] = await prisma.monitoringPoint.findMany({ where: { machineId: fan } });
    expect(point.machineType).toBe('PUMP');

    await insert(fan, 'PUMP', 'PUMP_MOTOR_DE');
    await expect(
      prisma.machine.update({ where: { id: fan }, data: { type: 'FAN' } }),
    ).rejects.toThrow(/monitoring_points_location_type_check/);
    expect((await prisma.machine.findUniqueOrThrow({ where: { id: fan } })).type).toBe('PUMP');
  });

  it('removes the points when the machine is deleted (B6)', async () => {
    await insert(pump, 'PUMP', 'PUMP_MOTOR_DE');

    await prisma.machine.delete({ where: { id: pump } });

    expect(await prisma.monitoringPoint.count()).toBe(0);
  });

  it('sorts positions in power-flow order, OTHER last', async () => {
    for (const location of [
      'OTHER',
      'PUMP_IMPELLER_SIDE',
      'PUMP_MOTOR_NDE',
      'PUMP_COUPLING_SIDE',
    ]) {
      await insert(pump, 'PUMP', location);
    }

    const points = await prisma.monitoringPoint.findMany({ orderBy: { location: 'asc' } });

    expect(points.map((point) => point.location)).toEqual([
      'PUMP_MOTOR_NDE',
      'PUMP_COUPLING_SIDE',
      'PUMP_IMPELLER_SIDE',
      'OTHER',
    ]);
  });
});
