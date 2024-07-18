import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringPointsController } from './monitoring-points.controller';
import { MonitoringPointsService } from './monitoring-points.service';

describe('MonitoringPointsController', () => {
  let controller: MonitoringPointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitoringPointsController],
      providers: [MonitoringPointsService],
    }).compile();

    controller = module.get<MonitoringPointsController>(MonitoringPointsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
