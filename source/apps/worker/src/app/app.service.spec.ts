import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { prisma, redis } from '@source/persistence';

jest.mock('@source/persistence', () => ({
  prisma: {
    sensor: {
      findUnique: jest.fn(),
    },
    telemetry: {
      create: jest.fn(),
    },
  },
  redis: {
    incr: jest.fn(),
    hset: jest.fn(),
    lpush: jest.fn(),
    ltrim: jest.fn(),
    publish: jest.fn(),
  },
}));

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processTelemetry', () => {
    const mockTelemetryData = {
      sensorId: 'sensor-1',
      accelerationValue: 1.2,
      velocityValue: 5.4,
      temperatureValue: 35.6,
      timestamp: new Date().toISOString(),
    };

    it('should process telemetry successfully if sensor exists', async () => {
      (prisma.sensor.findUnique as jest.Mock).mockResolvedValue({ id: 'sensor-1' });

      await service.processTelemetry(mockTelemetryData);

      expect(prisma.sensor.findUnique).toHaveBeenCalledWith({ where: { id: 'sensor-1' } });
      expect(prisma.telemetry.create).toHaveBeenCalled();
      expect(redis.incr).toHaveBeenCalledWith('telemetry:global:total_count');
      expect(redis.hset).toHaveBeenCalled();
      expect(redis.lpush).toHaveBeenCalled();
      expect(redis.publish).toHaveBeenCalled();
    });

    it('should ignore telemetry if sensor does not exist', async () => {
      (prisma.sensor.findUnique as jest.Mock).mockResolvedValue(null);
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await service.processTelemetry(mockTelemetryData);

      expect(prisma.sensor.findUnique).toHaveBeenCalled();
      expect(prisma.telemetry.create).not.toHaveBeenCalled();
      expect(redis.incr).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Ignoring'));
      
      consoleWarnSpy.mockRestore();
    });

    it('should log error if processing fails', async () => {
      (prisma.sensor.findUnique as jest.Mock).mockRejectedValue(new Error('DB Error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await service.processTelemetry(mockTelemetryData);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error processing telemetry:', expect.any(Error));
      
      consoleErrorSpy.mockRestore();
    });
  });
});
