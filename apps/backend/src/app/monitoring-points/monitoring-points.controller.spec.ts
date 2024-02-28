import EventEmitter from 'events';
import httpMock from 'node-mocks-http';
import { HttpStatus } from '@nestjs/common';
import { JwtStrategy } from '../guard/jwt.strategy';
import { PrismaService } from '../database/PrismaService';
import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringPointsService } from './monitoring-points.service';
import { MonitoringPointsController } from './monitoring-points.controller';
import { mockedMonitoringPoints, mockedMonitoringPointsPrisma } from '../../mocks/index.mock';

describe('MonitoringPointsController', () => {
  let controller: MonitoringPointsController;
  let service: MonitoringPointsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitoringPointsController],
      providers: [
        JwtStrategy,
        MonitoringPointsService,
        { provide: PrismaService, useValue: mockedMonitoringPointsPrisma },
      ],
    }).compile();

    controller = module.get<MonitoringPointsController>(MonitoringPointsController);
    service = module.get<MonitoringPointsService>(MonitoringPointsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should create a monitoring point', async () => {
    const body = {
      name: mockedMonitoringPoints[0].name,
      machineId: mockedMonitoringPoints[0].machineId,
      sensorId: mockedMonitoringPoints[0].sensorId,
    };
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });
    await controller.create(body, res);
    expect(prisma.monitoringPoint.create).toHaveBeenCalledWith({ data: body });

    const statusCode = res._getStatusCode();
    const response = res._getJSONData();

    expect(response).toEqual(mockedMonitoringPoints[0]);
    expect(statusCode).toBe(HttpStatus.CREATED);
  });

  it('should not create a monitoring point', async () => {
    const body = {
      name: 'Monitoring Point 4',
      machineId: 2,
      sensorId: 4,
    };
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });
    await controller.create(body, res);
    expect(prisma.monitoringPoint.create).not.toHaveBeenCalled();

    const statusCode = res._getStatusCode();
    const response = res._getJSONData();

    expect(response).toEqual('Sensor already assigned to a monitoring point');
    expect(statusCode).toBe(HttpStatus.CONFLICT);
  });

  it('should find all monitoring points', async () => {
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });
    await controller.findAll(res);
    expect(prisma.monitoringPoint.findMany).toHaveBeenCalledTimes(1);

    const statusCode = res._getStatusCode();
    const response = res._getJSONData();

    expect(response).toEqual(mockedMonitoringPoints);
    expect(statusCode).toBe(HttpStatus.OK);
  });

  it('should find one monitoring point', async () => {
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });
    await controller.findOne('1', res);
    expect(prisma.monitoringPoint.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });

    const statusCode = res._getStatusCode();
    const response = res._getJSONData();

    expect(response).toEqual(mockedMonitoringPoints[0]);
    expect(statusCode).toBe(HttpStatus.OK);
  });

  it('should update a monitoring point', async () => {
    const body = {
      name: 'Monitoring Point 1',
      machineId: 1,
      sensorId: 1,
    };
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });
    await controller.update('1', body, res);
    expect(prisma.monitoringPoint.update).toHaveBeenCalledWith({ where: { id: 1 }, data: body });

    const statusCode = res._getStatusCode();
    const response = res._getJSONData();

    expect(response).toEqual(mockedMonitoringPoints[0]);
    expect(statusCode).toBe(HttpStatus.OK);
  });

  it('should not update a monitoring point', async () => {
    const body = {
      name: 'Monitoring Point 4',
      machineId: 2,
      sensorId: 4,
    };
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });
    await controller.update('1', body, res);
    expect(prisma.monitoringPoint.update).not.toHaveBeenCalled();

    const statusCode = res._getStatusCode();
    const response = res._getJSONData();

    expect(response).toEqual('Sensor already assigned to a monitoring point');
    expect(statusCode).toBe(HttpStatus.CONFLICT);
  });

  it('should delete a monitoring point', async () => {
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });
    await controller.remove('1', res);
    expect(prisma.monitoringPoint.delete).toHaveBeenCalledWith({ where: { id: 1 } });

    const statusCode = res._getStatusCode();
    const response = res._getJSONData();

    expect(response).toEqual('Monitoring Point removed');
    expect(statusCode).toBe(HttpStatus.NO_CONTENT);
  });
});
