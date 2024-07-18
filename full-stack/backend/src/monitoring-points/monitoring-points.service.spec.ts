import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringPointsService } from './monitoring-points.service';

describe('MonitoringPointsService', () => {
  let service: MonitoringPointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitoringPointsService],
    }).compile();

    service = module.get<MonitoringPointsService>(MonitoringPointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
