import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringPointsService } from './monitoring-points.service';
import { prisma, MachineType, SensorModel } from '@source/persistence';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('@source/persistence', () => ({
  prisma: {
    monitoringPoint: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
    sensor: {
      upsert: jest.fn(),
    },
  },
  MachineType: {
    Pump: 'Pump',
    Fan: 'Fan',
  },
  SensorModel: {
    TcAg: 'TcAg',
    TcAs: 'TcAs',
    HF_Plus: 'HF_Plus',
  },
}));

describe('MonitoringPointsService', () => {
  let service: MonitoringPointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitoringPointsService],
    }).compile();

    service = module.get<MonitoringPointsService>(MonitoringPointsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated monitoring points', async () => {
      const items = [{ id: 1, name: 'MP1' }];
      const total = 1;
      (prisma.monitoringPoint.findMany as jest.Mock).mockResolvedValue(items);
      (prisma.monitoringPoint.count as jest.Mock).mockResolvedValue(total);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({ items, total, page: 1, limit: 10 });
      expect(prisma.monitoringPoint.findMany).toHaveBeenCalled();
    });
  });

  describe('associateSensor', () => {
    it('should associate a valid sensor', async () => {
      const point = { id: 1, machine: { type: MachineType.Fan } };
      const sensorData = { id: 'sensor-1', model: SensorModel.HF_Plus };
      
      (prisma.monitoringPoint.findUnique as jest.Mock).mockResolvedValue(point);
      (prisma.sensor.upsert as jest.Mock).mockResolvedValue({ id: sensorData.id });

      const result = await service.associateSensor(1, sensorData);

      expect(result.id).toBe(sensorData.id);
      expect(prisma.sensor.upsert).toHaveBeenCalled();
    });

    it('should throw BadRequestException if Pump uses TcAg or TcAs', async () => {
      const point = { id: 1, machine: { type: MachineType.Pump } };
      const sensorData = { id: 'sensor-1', model: SensorModel.TcAg };
      
      (prisma.monitoringPoint.findUnique as jest.Mock).mockResolvedValue(point);

      await expect(service.associateSensor(1, sensorData)).rejects.toThrow(BadRequestException);
      await expect(service.associateSensor(1, sensorData)).rejects.toThrow('Pump machines cannot use TcAg or TcAs sensors');
    });

    it('should throw NotFoundException if point not found', async () => {
      (prisma.monitoringPoint.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.associateSensor(1, { id: 's1', model: SensorModel.HF_Plus })).rejects.toThrow(NotFoundException);
    });
  });
});
