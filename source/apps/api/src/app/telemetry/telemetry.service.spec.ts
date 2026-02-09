import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryService } from './telemetry.service';
import { prisma, redis } from '@source/persistence';

jest.mock('@source/persistence', () => ({
  prisma: {
    telemetry: {
      findMany: jest.fn(),
      count: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
  redis: {
    get: jest.fn(),
  },
}));

describe('TelemetryService', () => {
  let service: TelemetryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelemetryService],
    }).compile();

    service = module.get<TelemetryService>(TelemetryService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMetrics', () => {
    it('should return metrics from redis', async () => {
      (redis.get as jest.Mock).mockResolvedValue('100');
      const result = await service.getMetrics();
      expect(result).toEqual({ total_telemetry_count: 100 });
      expect(redis.get).toHaveBeenCalledWith('telemetry:global:total_count');
    });

    it('should return 0 if redis returns null', async () => {
      (redis.get as jest.Mock).mockResolvedValue(null);
      const result = await service.getMetrics();
      expect(result).toEqual({ total_telemetry_count: 0 });
    });
  });

  describe('findAll', () => {
    it('should return paginated telemetry', async () => {
      const items = [{ id: BigInt(1), accelerationValue: 1.5 }];
      const total = 1;
      (prisma.telemetry.findMany as jest.Mock).mockResolvedValue(items);
      (prisma.telemetry.count as jest.Mock).mockResolvedValue(total);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({ items, total, page: 1, limit: 10 });
      expect(prisma.telemetry.findMany).toHaveBeenCalled();
    });
  });

  describe('deleteMany', () => {
    it('should delete specified telemetry IDs', async () => {
      const ids = [1, 2, 3];
      await service.deleteMany(ids);
      expect(prisma.telemetry.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: ids } },
      });
    });
  });
});
