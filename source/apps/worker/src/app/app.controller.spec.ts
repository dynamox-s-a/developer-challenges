import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

jest.mock('@source/persistence', () => ({
  prisma: {},
  redis: {},
}));

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  const mockAppService = {
    processTelemetry: jest.fn(),
    handleSensorUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call processTelemetry on telemetry_data message', async () => {
    const data = { sensorId: '1', accelerationValue: 1, velocityValue: 2, temperatureValue: 3 };
    await controller.processTelemetry(data);
    expect(service.processTelemetry).toHaveBeenCalledWith(data);
  });

  it('should call handleSensorUpdate on sensor_update message', async () => {
    const data = { id: '1', update: 'test' };
    await controller.handleSensorUpdate(data);
    expect(service.handleSensorUpdate).toHaveBeenCalledWith(data);
  });
});
