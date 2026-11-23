import {
  countTimeSeries,
  createTimeSeries,
  deleteTimeSeries,
  getTimeSeries,
  getTimeSeriesMetrics,
  listTimeSeries,
} from './time-series.service.ts';

// As funções falsas do banco, criadas antes do vi.mock. O service usa o
// getMonitoringPoint, que procura o ponto em prisma.monitoringPoint
const { db, tx } = vi.hoisted(() => ({
  db: {
    monitoringPoint: { findUnique: vi.fn() },
    sensor: { findUnique: vi.fn() },
    timeSeries: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
    $queryRaw: vi.fn(),
  },
  // O que roda dentro da transação usa o "tx", e não o prisma
  tx: { timeSeries: { create: vi.fn() }, $executeRaw: vi.fn() },
}));

vi.mock('../../lib/prisma.ts', () => ({ prisma: db }));

const point = {
  id: 'point-1',
  name: 'Mancal LA',
  machineId: 'machine-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const sensor = {
  id: 'sensor-1',
  model: 'HF+',
  serialNumber: 'DyL4.01.A0000',
  monitoringPointId: 'point-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Já no formato que sai do timeSeriesSchema, e fora de ordem de propósito
const data = {
  name: 'Temperatura',
  unit: '°C',
  samples: [
    { timestamp: new Date('2026-11-22T10:10:00Z'), value: 32 },
    { timestamp: new Date('2026-11-22T10:00:00Z'), value: 31.5 },
    { timestamp: new Date('2026-11-22T10:20:00Z'), value: 33 },
    { timestamp: new Date('2026-11-22T10:05:00Z'), value: 31.8 },
  ],
};

const SUMMARY = {
  id: true,
  name: true,
  unit: true,
  sensorSerialNumber: true,
  monitoringPointId: true,
  sampleCount: true,
  startedAt: true,
  endedAt: true,
  createdAt: true,
};

describe('time series service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // A transação falsa só roda a função que recebe, passando o tx
    db.$transaction.mockImplementation((callback) => callback(tx));
  });

  it('should save the series with the sensor and a summary of the samples', async () => {
    const created = { id: 'series-1' };
    db.monitoringPoint.findUnique.mockResolvedValue(point);
    db.sensor.findUnique.mockResolvedValue(sensor);
    tx.timeSeries.create.mockResolvedValue(created);

    await expect(createTimeSeries('point-1', data)).resolves.toBe(created);
    expect(db.sensor.findUnique).toHaveBeenCalledWith({
      where: { monitoringPointId: 'point-1' },
    });
    expect(tx.timeSeries.create).toHaveBeenCalledWith({
      data: {
        name: 'Temperatura',
        unit: '°C',
        sensorSerialNumber: 'DyL4.01.A0000',
        monitoringPointId: 'point-1',
        sampleCount: 4,
        startedAt: new Date('2026-11-22T10:00:00Z'),
        endedAt: new Date('2026-11-22T10:20:00Z'),
      },
      select: SUMMARY,
    });
    // O INSERT das medições recebe o id da série e as duas listas
    expect(tx.$executeRaw).toHaveBeenCalledWith(
      expect.anything(), // o texto do SQL
      'series-1',
      [
        '2026-11-22T10:10:00.000Z',
        '2026-11-22T10:00:00.000Z',
        '2026-11-22T10:20:00.000Z',
        '2026-11-22T10:05:00.000Z',
      ],
      [32, 31.5, 33, 31.8],
    );
  });

  it('should fail the whole upload when the samples cannot be saved', async () => {
    db.monitoringPoint.findUnique.mockResolvedValue(point);
    db.sensor.findUnique.mockResolvedValue(sensor);
    tx.timeSeries.create.mockResolvedValue({ id: 'series-1' });
    tx.$executeRaw.mockRejectedValue(new Error('o banco recusou'));

    // O erro chega à transação, e o Prisma desfaz o create da série
    await expect(createTimeSeries('point-1', data)).rejects.toThrow(
      'o banco recusou',
    );
  });

  it('should not save data on a point without a sensor', async () => {
    db.monitoringPoint.findUnique.mockResolvedValue(point);
    db.sensor.findUnique.mockResolvedValue(null);

    await expect(createTimeSeries('point-1', data)).rejects.toMatchObject({
      statusCode: 409,
      code: 'POINT_WITHOUT_SENSOR',
    });
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it('should not save data on a point that does not exist', async () => {
    db.monitoringPoint.findUnique.mockResolvedValue(null);

    await expect(createTimeSeries('nao-existe', data)).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it('should list the series of the point, the most recent first', async () => {
    const series = [{ id: 'series-2' }, { id: 'series-1' }];
    db.monitoringPoint.findUnique.mockResolvedValue(point);
    db.timeSeries.findMany.mockResolvedValue(series);

    await expect(listTimeSeries('point-1')).resolves.toBe(series);
    expect(db.timeSeries.findMany).toHaveBeenCalledWith({
      where: { monitoringPointId: 'point-1' },
      orderBy: [{ startedAt: 'desc' }, { id: 'asc' }],
      select: SUMMARY,
    });
  });

  it('should not list the series of a point that does not exist', async () => {
    db.monitoringPoint.findUnique.mockResolvedValue(null);

    await expect(listTimeSeries('nao-existe')).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(db.timeSeries.findMany).not.toHaveBeenCalled();
  });
});

describe('time series by id', () => {
  beforeEach(() => vi.resetAllMocks());

  it('should count the series of every point', async () => {
    db.timeSeries.count.mockResolvedValue(3);

    await expect(countTimeSeries()).resolves.toBe(3);
    expect(db.timeSeries.count).toHaveBeenCalledWith(); // sem filtro
  });

  it('should get a full series with the samples in time order', async () => {
    const series = { id: 'series-1', samples: [] };
    db.timeSeries.findUnique.mockResolvedValue(series);

    await expect(getTimeSeries('series-1')).resolves.toBe(series);
    expect(db.timeSeries.findUnique).toHaveBeenCalledWith({
      where: { id: 'series-1' },
      select: {
        ...SUMMARY,
        samples: {
          select: { timestamp: true, value: true },
          orderBy: { timestamp: 'asc' },
        },
      },
    });
  });

  it('should calculate the metrics in the database', async () => {
    const metrics = {
      count: 4,
      min: 31.5,
      max: 33,
      mean: 32,
      stdDev: 0.5,
      rms: 32,
    };
    db.timeSeries.findUnique.mockResolvedValue({ id: 'series-1' });
    db.$queryRaw.mockResolvedValue([metrics]);

    await expect(getTimeSeriesMetrics('series-1')).resolves.toBe(metrics);
    // Para conferir se a série existe, não traz as medições
    expect(db.timeSeries.findUnique).toHaveBeenCalledWith({
      where: { id: 'series-1' },
      select: { id: true },
    });
    expect(db.$queryRaw).toHaveBeenCalledWith(
      expect.anything(), // o texto do SQL
      'series-1',
    );
  });

  it('should delete a series that exists', async () => {
    db.timeSeries.findUnique.mockResolvedValue({ id: 'series-1' });

    await deleteTimeSeries('series-1');

    expect(db.timeSeries.delete).toHaveBeenCalledWith({
      where: { id: 'series-1' },
    });
  });

  it('should answer 404 for a series that does not exist', async () => {
    db.timeSeries.findUnique.mockResolvedValue(null);
    const notFound = {
      statusCode: 404,
      message: 'Série temporal não encontrada',
    };

    await expect(getTimeSeries('nao-existe')).rejects.toMatchObject(notFound);
    await expect(getTimeSeriesMetrics('nao-existe')).rejects.toMatchObject(
      notFound,
    );
    await expect(deleteTimeSeries('nao-existe')).rejects.toMatchObject(
      notFound,
    );
    expect(db.$queryRaw).not.toHaveBeenCalled();
    expect(db.timeSeries.delete).not.toHaveBeenCalled();
  });
});
