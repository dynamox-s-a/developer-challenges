import { Test, TestingModule } from '@nestjs/testing';
import { SensorController } from './sensor.controller';

describe('SensorController', () => {
  let controller: SensorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorController],
    }).compile();

    controller = module.get<SensorController>(SensorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
