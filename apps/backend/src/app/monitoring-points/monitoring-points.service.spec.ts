import { HttpStatus } from '@nestjs/common';
import { JwtStrategy } from '../guard/jwt.strategy';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/PrismaService';
import { MonitoringPointsService } from './monitoring-points.service';
import { mockedMonitoringPoints, mockedMonitoringPointsPrisma } from '../../mocks/index.mock';

describe('MonitoringPointsService', () => {
  let service: MonitoringPointsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        MonitoringPointsService,
        { provide: PrismaService, useValue: mockedMonitoringPointsPrisma },
      ],
    }).compile();

    service = module.get<MonitoringPointsService>(MonitoringPointsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should create a monitoring point', async () => {
    const monitoringPoint = {
      name: mockedMonitoringPoints[0].name,
      machineId: mockedMonitoringPoints[0].machineId,
      sensorId: mockedMonitoringPoints[0].sensorId,
    };
    expect(await service.create(monitoringPoint)).toEqual({
      statusCode: HttpStatus.CREATED,
      data: mockedMonitoringPoints[0],
    });
    expect(prisma.monitoringPoint.create).toHaveBeenCalledWith({
      data: monitoringPoint,
    });
    expect(prisma.monitoringPoint.create).toHaveBeenCalledTimes(1);
  });

  it('should not create a monitoring point', async () => {
    const monitoringPoint = {
      name: 'Monitoring Point 4',
      machineId: 2,
      sensorId: 4,
    };
    expect(await service.create(monitoringPoint)).toEqual({
      statusCode: HttpStatus.CONFLICT,
      data: 'Sensor already assigned to a monitoring point',
    });
    expect(prisma.monitoringPoint.create).toHaveBeenCalledTimes(0);
  });

  it('should find all monitoring points', async () => {
    expect(await service.findAll()).toEqual({
      statusCode: HttpStatus.OK,
      data: mockedMonitoringPoints,
    });
    expect(prisma.monitoringPoint.findMany).toHaveBeenCalledTimes(1);
  });

  it('should find one monitoring point', async () => {
    expect(await service.findOne(1)).toEqual({
      statusCode: HttpStatus.OK,
      data: mockedMonitoringPoints[0],
    });
    expect(prisma.monitoringPoint.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prisma.monitoringPoint.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should update a monitoring point', async () => {
    const monitoringPoint = {
      name: 'Monitoring Point 1',
      machineId: 1,
      sensorId: 1,
    };
    expect(await service.update(1, monitoringPoint)).toEqual({
      statusCode: HttpStatus.OK,
      data: mockedMonitoringPoints[0],
    });
    expect(prisma.monitoringPoint.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: monitoringPoint,
    });
    expect(prisma.monitoringPoint.update).toHaveBeenCalledTimes(1);
  });

  it('should not update a monitoring point', async () => {
    const monitoringPoint = {
      name: 'Monitoring Point 4',
      machineId: 2,
      sensorId: 4,
    };
    expect(await service.update(1, monitoringPoint)).toEqual({
      statusCode: HttpStatus.CONFLICT,
      data: 'Sensor already assigned to a monitoring point',
    });
    expect(prisma.monitoringPoint.update).toHaveBeenCalledTimes(0);
  });

  it('should delete a monitoring point', async () => {
    expect(await service.remove(1)).toEqual({
      statusCode: HttpStatus.NO_CONTENT,
      data: 'Monitoring Point removed',
    });
    expect(prisma.monitoringPoint.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prisma.monitoringPoint.delete).toHaveBeenCalledTimes(1);
  });
});
