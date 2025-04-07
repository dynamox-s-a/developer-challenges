import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringPointService } from './monitoring-point.service';

describe('MonitoringPointService', () => {
  let service: MonitoringPointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitoringPointService],
    }).compile();

    service = module.get<MonitoringPointService>(MonitoringPointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
