import { Prisma } from '../../generated/prisma/client.ts';
import {
  createMonitoringPoint,
  deleteMonitoringPoint,
  removeSensor,
  setSensor,
} from './monitoring-points.service.ts';

// As funções falsas do banco, criadas antes do vi.mock. O service de pontos
// também usa o getMachine, que procura a máquina em prisma.machine
const db = vi.hoisted(() => ({
  machine: { findUnique: vi.fn() },
  monitoringPoint: { findUnique: vi.fn(), create: vi.fn(), delete: vi.fn() },
  sensor: { findUnique: vi.fn(), upsert: vi.fn(), delete: vi.fn() },
}));

vi.mock('../../lib/prisma.ts', () => ({ prisma: db }));

const machine = {
  id: 'machine-1',
  name: 'Bomba 01',
  type: 'Pump',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const point = {
  id: 'point-1',
  name: 'Mancal LA',
  machineId: 'machine-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const sensor = {
  id: 'sensor-1',
  model: 'TcAg',
  serialNumber: 'DyL1.01.A0000',
  monitoringPointId: 'point-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('monitoring points service', () => {
  beforeEach(() => vi.resetAllMocks());

  it('should create the point in the machine', async () => {
    db.machine.findUnique.mockResolvedValue(machine);
    db.monitoringPoint.create.mockResolvedValue(point);

    await expect(
      createMonitoringPoint('machine-1', { name: 'Mancal LA' }),
    ).resolves.toEqual(point);
    expect(db.monitoringPoint.create).toHaveBeenCalledWith({
      data: { name: 'Mancal LA', machineId: 'machine-1' },
    });
  });

  it('should not create a point in a machine that does not exist', async () => {
    db.machine.findUnique.mockResolvedValue(null);

    await expect(
      createMonitoringPoint('nao-existe', { name: 'Mancal LA' }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: 'Máquina não encontrada',
    });
    expect(db.monitoringPoint.create).not.toHaveBeenCalled();
  });

  it('should delete a point that exists', async () => {
    db.monitoringPoint.findUnique.mockResolvedValue(point);

    await deleteMonitoringPoint('point-1');

    expect(db.monitoringPoint.delete).toHaveBeenCalledWith({
      where: { id: 'point-1' },
    });
  });

  it('should not delete a point that does not exist', async () => {
    db.monitoringPoint.findUnique.mockResolvedValue(null);

    await expect(deleteMonitoringPoint('nao-existe')).rejects.toMatchObject({
      statusCode: 404,
      message: 'Ponto de monitoramento não encontrado',
    });
    expect(db.monitoringPoint.delete).not.toHaveBeenCalled();
  });
});

describe('monitoring point sensor', () => {
  const tcag = { model: 'TcAg', serialNumber: 'DyL1.01.A0000' } as const;

  beforeEach(() => {
    vi.resetAllMocks();
    db.monitoringPoint.findUnique.mockResolvedValue(point);
  });

  it('should put the sensor on the point', async () => {
    db.machine.findUnique.mockResolvedValue({ ...machine, type: 'Fan' });
    db.sensor.upsert.mockResolvedValue(sensor);

    await expect(setSensor('point-1', tcag)).resolves.toEqual(sensor);
    expect(db.sensor.upsert).toHaveBeenCalledWith({
      where: { monitoringPointId: 'point-1' },
      create: { ...tcag, monitoringPointId: 'point-1' },
      update: tcag,
    });
  });

  it('should not put a TcAg sensor on a pump', async () => {
    db.machine.findUnique.mockResolvedValue(machine);

    await expect(setSensor('point-1', tcag)).rejects.toMatchObject({
      statusCode: 422,
      message: 'Máquinas do tipo Pump não aceitam sensores TcAg',
    });
    expect(db.sensor.upsert).not.toHaveBeenCalled();
  });

  it('should not put a sensor on a point that does not exist', async () => {
    db.monitoringPoint.findUnique.mockResolvedValue(null);

    await expect(setSensor('nao-existe', tcag)).rejects.toMatchObject({
      statusCode: 404,
      message: 'Ponto de monitoramento não encontrado',
    });
    expect(db.sensor.upsert).not.toHaveBeenCalled();
  });

  it('should not reuse a serial number that is already in use', async () => {
    db.machine.findUnique.mockResolvedValue({ ...machine, type: 'Fan' });
    // O mesmo erro que o Prisma lança quando o banco recusa um valor repetido
    db.sensor.upsert.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '7.10.1',
      }),
    );

    await expect(setSensor('point-1', tcag)).rejects.toMatchObject({
      statusCode: 409,
      message: 'O número de série DyL1.01.A0000 já está em outro sensor',
    });
  });

  it('should let other database errors through', async () => {
    db.machine.findUnique.mockResolvedValue({ ...machine, type: 'Fan' });
    const failure = new Error('O banco caiu');
    db.sensor.upsert.mockRejectedValue(failure);

    await expect(setSensor('point-1', tcag)).rejects.toBe(failure);
  });

  it('should remove the sensor of the point', async () => {
    db.sensor.findUnique.mockResolvedValue(sensor);

    await removeSensor('point-1');

    expect(db.sensor.delete).toHaveBeenCalledWith({
      where: { id: 'sensor-1' },
    });
  });

  it('should not remove a sensor from a point without one', async () => {
    db.sensor.findUnique.mockResolvedValue(null);

    await expect(removeSensor('point-1')).rejects.toMatchObject({
      statusCode: 404,
      message: 'Este ponto não tem sensor',
    });
    expect(db.sensor.delete).not.toHaveBeenCalled();
  });

  it('should not remove a sensor from a point that does not exist', async () => {
    db.monitoringPoint.findUnique.mockResolvedValue(null);

    await expect(removeSensor('nao-existe')).rejects.toMatchObject({
      statusCode: 404,
      message: 'Ponto de monitoramento não encontrado',
    });
    expect(db.sensor.delete).not.toHaveBeenCalled();
  });
});
