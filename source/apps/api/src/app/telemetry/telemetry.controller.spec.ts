import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';

jest.mock('@source/persistence', () => ({
  prisma: {},
  redis: {},
  MachineType: { Pump: 'Pump', Fan: 'Fan' },
  SensorModel: { TcAg: 'TcAg', TcAs: 'TcAs', HF_Plus: 'HF_Plus' },
}));

describe('TelemetryController', () => {
  let controller: TelemetryController;
  let service: TelemetryService;

  const mockService = {
    findAll: jest.fn(),
    getMetrics: jest.fn(),
    getHistoryBySensor: jest.fn(),
    deleteOne: jest.fn(),
    deleteMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelemetryController],
      providers: [
        {
          provide: TelemetryService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TelemetryController>(TelemetryController);
    service = module.get<TelemetryService>(TelemetryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll', async () => {
    mockService.findAll.mockResolvedValue({ items: [], total: 0 });
    await controller.findAll('1', '10');
    expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined);
  });

  it('should call getMetrics', async () => {
    mockService.getMetrics.mockResolvedValue({ total_telemetry_count: 0 });
    await controller.getMetrics();
    expect(service.getMetrics).toHaveBeenCalled();
  });

  it('should call getHistory', async () => {
    mockService.getHistoryBySensor.mockResolvedValue([]);
    await controller.getHistory('sensor-1');
    expect(service.getHistoryBySensor).toHaveBeenCalledWith('sensor-1');
  });

  it('should call deleteOne when one ID is provided', async () => {
    mockService.deleteOne.mockResolvedValue({});
    await controller.delete('1');
    expect(service.deleteOne).toHaveBeenCalledWith(1);
  });

  it('should call deleteMany when multiple IDs are provided', async () => {
    mockService.deleteMany.mockResolvedValue({});
    await controller.delete('1,2,3');
    expect(service.deleteMany).toHaveBeenCalledWith([1, 2, 3]);
  });
});
