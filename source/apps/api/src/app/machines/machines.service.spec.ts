import { Test, TestingModule } from '@nestjs/testing';
import { MachinesService } from './machines.service';
import { prisma, MachineType, SensorModel } from '@source/persistence';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('@source/persistence', () => ({
  prisma: {
    machine: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    monitoringPoint: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    sensor: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    telemetry: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(prisma)),
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

describe('MachinesService', () => {
  let service: MachinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MachinesService],
    }).compile();

    service = module.get<MachinesService>(MachinesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of machines', async () => {
      const result = [{ id: 1, name: 'Machine 1', type: MachineType.Fan }];
      (prisma.machine.findMany as jest.Mock).mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
      expect(prisma.machine.findMany).toHaveBeenCalledWith({
        include: { monitoringPoints: { include: { sensor: true } } },
      });
    });
  });

  describe('findOne', () => {
    it('should return a machine if found', async () => {
      const result = { id: 1, name: 'Machine 1', type: MachineType.Fan };
      (prisma.machine.findUnique as jest.Mock).mockResolvedValue(result);

      expect(await service.findOne(1)).toEqual(result);
    });

    it('should throw NotFoundException if machine not found', async () => {
      (prisma.machine.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a machine with valid data', async () => {
      const data = {
        name: 'New Machine',
        type: MachineType.Fan,
        monitoringPoints: [
          { name: 'MP1', sensor: { model: SensorModel.HF_Plus } },
          { name: 'MP2' },
        ],
      };
      const result = { id: 1, ...data };
      (prisma.machine.create as jest.Mock).mockResolvedValue(result);

      expect(await service.create(data as any)).toEqual(result);
      expect(prisma.machine.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if less than 2 monitoring points', async () => {
      const data = {
        name: 'Invalid Machine',
        type: MachineType.Fan,
        monitoringPoints: [{ name: 'MP1' }],
      };

      await expect(service.create(data as any)).rejects.toThrow(BadRequestException);
      await expect(service.create(data as any)).rejects.toThrow('A machine must have at least 2 monitoring points');
    });

    it('should throw BadRequestException if Pump uses TcAg or TcAs', async () => {
      const data = {
        name: 'Invalid Pump',
        type: MachineType.Pump,
        monitoringPoints: [
          { name: 'MP1', sensor: { model: SensorModel.TcAg } },
          { name: 'MP2' },
        ],
      };

      await expect(service.create(data as any)).rejects.toThrow(BadRequestException);
      await expect(service.create(data as any)).rejects.toThrow('Pump machines cannot use TcAg or TcAs sensors');
    });
  });

  describe('remove', () => {
    it('should remove a machine and its components in a transaction', async () => {
      const mpIds = [{ id: 10 }, { id: 11 }];
      const sensorIds = [{ id: 100 }];
      
      (prisma.monitoringPoint.findMany as jest.Mock).mockResolvedValue(mpIds);
      (prisma.sensor.findMany as jest.Mock).mockResolvedValue(sensorIds);
      (prisma.machine.delete as jest.Mock).mockResolvedValue({ id: 1 });

      await service.remove(1);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.telemetry.deleteMany).toHaveBeenCalledWith({
        where: { sensorId: { in: [100] } },
      });
      expect(prisma.sensor.deleteMany).toHaveBeenCalledWith({
        where: { monitoringPointId: { in: [10, 11] } },
      });
      expect(prisma.monitoringPoint.deleteMany).toHaveBeenCalledWith({
        where: { machineId: 1 },
      });
      expect(prisma.machine.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
