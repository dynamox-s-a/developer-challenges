import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringPointController } from './monitoring-points.controller';
import { MonitoringPointService } from './monitoring-points.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MonitoringPointController', () => {
  let controller: MonitoringPointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitoringPointController],
      providers: [MonitoringPointService, PrismaService],
    }).compile();

    controller = module.get<MonitoringPointController>(
      MonitoringPointController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
