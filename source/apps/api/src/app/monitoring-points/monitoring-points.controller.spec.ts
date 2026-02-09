import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringPointsController } from './monitoring-points.controller';
import { MonitoringPointsService } from './monitoring-points.service';

jest.mock('@source/persistence', () => ({
  prisma: {},
  MachineType: { Pump: 'Pump', Fan: 'Fan' },
  SensorModel: { TcAg: 'TcAg', TcAs: 'TcAs', HF_Plus: 'HF_Plus' },
}));

describe('MonitoringPointsController', () => {
  let controller: MonitoringPointsController;
  let service: MonitoringPointsService;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    associateSensor: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitoringPointsController],
      providers: [
        {
          provide: MonitoringPointsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<MonitoringPointsController>(MonitoringPointsController);
    service = module.get<MonitoringPointsService>(MonitoringPointsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll', async () => {
    mockService.findAll.mockResolvedValue({ items: [], total: 0 });
    await controller.findAll('1');
    expect(service.findAll).toHaveBeenCalledWith(1, 5, 'name', 'asc');
  });

  it('should call associateSensor', async () => {
    const sensorData = { id: 's1', model: 'HF_Plus' as any };
    mockService.associateSensor.mockResolvedValue({});
    await controller.associateSensor(1, sensorData);
    expect(service.associateSensor).toHaveBeenCalledWith(1, sensorData);
  });
});
