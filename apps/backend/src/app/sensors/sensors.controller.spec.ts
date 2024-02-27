import EventEmitter from 'events';
import httpMock from 'node-mocks-http';
import { HttpStatus } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { JwtStrategy } from '../guard/jwt.strategy';
import { Test, TestingModule } from '@nestjs/testing';
import { SensorsController } from './sensors.controller';
import { PrismaService } from '../database/PrismaService';
import { CreateSensorDto, UpdateSensorDto } from '@dynamox-challenge/dto';

const fakeSensors = [
  {
    id: 1,
    model: 'TcAg',
  },
  {
    id: 2,
    model: 'TcAs',
  },
  {
    id: 3,
    model: 'HF+',
  },
];

const prismaMock = {
  sensor: {
    create: jest.fn().mockReturnValue(fakeSensors[1]),
    findUnique: jest.fn().mockImplementation(args => {
      if (args.where.id >= fakeSensors.length) {
        return null;
      }
      return fakeSensors[0];
    }),
    findMany: jest.fn().mockResolvedValue(fakeSensors),
    update: jest.fn().mockResolvedValue(fakeSensors[0]),
    delete: jest.fn(),
  },
};

describe('SensorsController', () => {
  let controller: SensorsController;
  let service: SensorsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorsController],
      providers: [
        JwtStrategy,
        SensorsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    controller = module.get<SensorsController>(SensorsController);
    service = module.get<SensorsService>(SensorsService);
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

  it('should create a sensor', async () => {
    const body: CreateSensorDto = {
      model: 'TcAs',
    };
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });
    await controller.create(body, res);
    expect(prisma.sensor.create).toHaveBeenCalledWith({ data: body });

    const statusCode = res._getStatusCode();
    const response = res._getJSONData();

    expect(response).toEqual(fakeSensors[1]);
    expect(statusCode).toBe(HttpStatus.CREATED);
  });

  it('should not create a sensor with invalid model', async () => {
    const body: CreateSensorDto = {
      model: 'TcA',
    };
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });
    await controller.create(body, res);
    expect(prisma.sensor.create).not.toHaveBeenCalled();

    const statusCode = res._getStatusCode();
    const response = res._getJSONData();

    expect(response).toEqual('Invalid model, expected: "TcAg", "TcAs" or "HF+", we got: TcA');
    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should get all sensors', async () => {
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });
    await controller.findAll(res);
    expect(prisma.sensor.findMany).toHaveBeenCalled();

    const statusCode = res._getStatusCode();
    const response = res._getJSONData();

    expect(response).toEqual(fakeSensors);
    expect(statusCode).toBe(HttpStatus.OK);
  });

  it('should get one sensor', async () => {
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });
    await controller.findOne('1', res);
    expect(prisma.sensor.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });

    const statusCode = res._getStatusCode();
    const response = res._getJSONData();

    expect(response).toEqual(fakeSensors[0]);
    expect(statusCode).toBe(HttpStatus.OK);
  });

  it('should not find one sensor', async () => {
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });
    await controller.findOne('4', res);
    expect(prisma.sensor.findUnique).toHaveBeenCalledWith({ where: { id: 4 } });

    const statusCode = res._getStatusCode();
    const response = res._getJSONData();

    expect(response).toEqual('Sensor not found');
    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('should update a sensor', async () => {
    const body: UpdateSensorDto = {
      model: 'TcAs',
    };
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });
    await controller.update('1', body, res);
    expect(prisma.sensor.update).toHaveBeenCalledWith({ where: { id: 1 }, data: body });

    const statusCode = res._getStatusCode();
    const response = res._getJSONData();

    expect(response).toEqual(fakeSensors[0]);
    expect(statusCode).toBe(HttpStatus.OK);
  });

  it('should not update a sensor with invalid model', async () => {
    const body: UpdateSensorDto = {
      model: 'TcA',
    };
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });
    await controller.update('1', body, res);
    expect(prisma.sensor.update).not.toHaveBeenCalled();

    const statusCode = res._getStatusCode();
    const response = res._getJSONData();

    expect(response).toEqual('Invalid model, expected: "TcAg", "TcAs" or "HF+", we got: TcA');
    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should delete a sensor', async () => {
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });
    await controller.remove('1', res);
    expect(prisma.sensor.delete).toHaveBeenCalledWith({ where: { id: 1 } });

    const statusCode = res._getStatusCode();
    const response = res._getJSONData();

    expect(response).toEqual('Sensor deleted');
    expect(statusCode).toBe(HttpStatus.NO_CONTENT);
  });
});
