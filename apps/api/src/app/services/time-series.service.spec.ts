import { createTimeSeriesService } from './time-series.service';

const mockTimeSeriesRepo = {
  create: jest.fn(),
  createMany: jest.fn(),
  findBySensorId: jest.fn(),
  countBySensorId: jest.fn(),
  deleteBySensorId: jest.fn(),
};

const mockSensorRepo = {
  findById: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const service = createTimeSeriesService(mockTimeSeriesRepo as any, mockSensorRepo as any);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('time-series.service', () => {
  describe('create', () => {
    it('throws 404 when sensor not found', async () => {
      mockSensorRepo.findById.mockResolvedValue(null);

      await expect(
        service.create({ sensorId: 'invalid', value: 1, timestamp: new Date().toISOString() })
      ).rejects.toMatchObject({ statusCode: 404, message: 'Sensor not found' });
      expect(mockTimeSeriesRepo.create).not.toHaveBeenCalled();
    });

    it('creates when sensor exists', async () => {
      mockSensorRepo.findById.mockResolvedValue({ id: 's1' });
      const data = { sensorId: 's1', value: 42.5, timestamp: '2025-02-07T12:00:00.000Z' };
      mockTimeSeriesRepo.create.mockResolvedValue({ id: 'ts1', ...data });

      const result = await service.create(data);
      expect(mockTimeSeriesRepo.create).toHaveBeenCalledWith({
        sensorId: 's1',
        value: 42.5,
        timestamp: new Date('2025-02-07T12:00:00.000Z'),
      });
      expect(result.value).toBe(42.5);
    });
  });

  describe('getMetrics', () => {
    it('throws 404 when sensor not found', async () => {
      mockSensorRepo.findById.mockResolvedValue(null);

      await expect(service.getMetrics('invalid')).rejects.toMatchObject({
        statusCode: 404,
        message: 'Sensor not found',
      });
    });

    it('returns count when sensor exists', async () => {
      mockSensorRepo.findById.mockResolvedValue({ id: 's1' });
      mockTimeSeriesRepo.countBySensorId.mockResolvedValue(100);

      const result = await service.getMetrics('s1');
      expect(result).toEqual({ sensorId: 's1', totalDataPoints: 100 });
    });
  });

  describe('deleteBySensorId', () => {
    it('throws 404 when sensor not found', async () => {
      mockSensorRepo.findById.mockResolvedValue(null);

      await expect(service.deleteBySensorId('invalid')).rejects.toMatchObject({
        statusCode: 404,
        message: 'Sensor not found',
      });
    });
  });
});
