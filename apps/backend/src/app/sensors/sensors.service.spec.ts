import { HttpStatus } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { JwtStrategy } from '../guard/jwt.strategy';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/PrismaService';
import { mockedSensors, mockedSensorsPrisma } from '../../mocks/index.mock';

describe('SensorsService', () => {
  let service: SensorsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        SensorsService,
        { provide: PrismaService, useValue: mockedSensorsPrisma },
      ],
    }).compile();

    service = module.get<SensorsService>(SensorsService);
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

  it('should create a sensor', async () => {
    const sensor = await service.create({ model: 'TcAs' });
    expect(sensor).toEqual({
      statusCode: HttpStatus.CREATED,
      data: mockedSensors[1],
    });
    expect(prisma.sensor.create).toHaveBeenCalledTimes(1);
  });

  it('should not create a sensor with invalid model', async () => {
    const sensor = await service.create({ model: 'TcA' });
    expect(sensor).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      data: 'Invalid model, expected: "TcAg", "TcAs" or "HF+", we got: TcA',
    });
    expect(prisma.sensor.create).toHaveBeenCalledTimes(0);
  });

  it('should find all sensors', async () => {
    const sensors = await service.findAll();
    expect(sensors).toEqual({
      statusCode: HttpStatus.OK,
      data: mockedSensors,
    });
    expect(prisma.sensor.findMany).toHaveBeenCalledTimes(1);
  });

  it('should find one sensor', async () => {
    const sensor = await service.findOne(1);
    expect(sensor).toEqual({
      statusCode: HttpStatus.OK,
      data: mockedSensors[0],
    });
    expect(prisma.sensor.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should not find one sensor', async () => {
    const sensor = await service.findOne(4);
    expect(sensor).toEqual({
      statusCode: HttpStatus.NOT_FOUND,
      data: 'Sensor not found',
    });
    expect(prisma.sensor.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should update a sensor', async () => {
    const sensor = await service.update(1, { model: 'TcAs' });
    expect(sensor).toEqual({
      statusCode: HttpStatus.OK,
      data: mockedSensors[0],
    });
    expect(prisma.sensor.update).toHaveBeenCalledTimes(1);
  });

  it('should not update a sensor with invalid model', async () => {
    const sensor = await service.update(1, { model: 'TcA' });
    expect(sensor).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      data: 'Invalid model, expected: "TcAg", "TcAs" or "HF+", we got: TcA',
    });
    expect(prisma.sensor.update).toHaveBeenCalledTimes(0);
  });

  it('should delete a sensor', async () => {
    const response = await service.remove(1);
    expect(response).toEqual({
      statusCode: HttpStatus.NO_CONTENT,
      data: 'Sensor deleted',
    });
    expect(prisma.sensor.delete).toHaveBeenCalledTimes(1);
  });
});
