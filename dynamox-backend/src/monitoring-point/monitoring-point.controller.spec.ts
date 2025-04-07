import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringPointController } from './monitoring-point.controller';
import { MonitoringPointService } from './monitoring-point.service';

describe('MonitoringPointController', () => {
  let controller: MonitoringPointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitoringPointController],
      providers: [MonitoringPointService],
    }).compile();

    controller = module.get<MonitoringPointController>(MonitoringPointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
