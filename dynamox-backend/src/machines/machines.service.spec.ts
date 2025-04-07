import { Test } from '@nestjs/testing';
import { MachinesService } from './machines.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SensorsService } from 'src/sensors/sensors.service';

describe('MachinesService', () => {
  let service: MachinesService;
  let prisma: PrismaService;
  let sensorsService: SensorsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MachinesService,
        {
          provide: PrismaService,
          useValue: {
            machine: {
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            monitoringPoint: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: SensorsService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: 'sensor-1',
              model: 'Tg01',
              monitoringPointId: 'S1',
              machineId: 'machine-123',
            }),
            findAll: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MachinesService>(MachinesService);
    prisma = module.get<PrismaService>(PrismaService);
    sensorsService = module.get<SensorsService>(SensorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a machine', async () => {
      const mockMachine = { id: 'uuid', name: 'Máquina X', type: 'Pump' };

      jest
        .spyOn(prisma.machine, 'create')
        .mockResolvedValue(mockMachine as any);

      const result = await service.create({ name: 'Máquina X', type: 'Pump' });

      expect(result).toEqual(mockMachine);
      expect(prisma.machine.create).toHaveBeenCalledWith({
        data: { name: 'Máquina X', type: 'Pump' },
      });
    });
  });

  describe('assignSensor', () => {
    const machineId = 'machine-123';

    const mockMachine = {
      id: machineId,
      name: 'Máquina Teste',
      type: 'Fan',
    };

    it('deve associar sensor com sucesso a uma máquina válida', async () => {
      jest.spyOn(prisma.machine, 'findUnique').mockResolvedValue(mockMachine);

      (sensorsService.create as jest.Mock).mockResolvedValueOnce({
        id: 'sensor-1',
        model: 'Tg01',
        monitoringPointId: 'S1',
        machineId,
      });

      const result = await service.assignSensor({
        machineId: 'machine-123',
        model: 'Tg01',
        monitoringPointId: 'S1',
      });

      expect(result).toEqual(
        expect.objectContaining({
          id: 'sensor-1',
          machineId,
          model: 'Tg01',
          monitoringPointId: 'S1',
        }),
      );

      expect(sensorsService.create).toHaveBeenCalledWith({
        model: 'Tg01',
        monitoringPointId: 'S1',
      });
    });

    it('deve lançar erro se a máquina não for encontrada', async () => {
      jest.spyOn(prisma.machine, 'findUnique').mockResolvedValue(null);

      await expect(
        service.assignSensor({
          model: 'Tg01',
          monitoringPointId: 'S1',
          machineId: 'some-id',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve lançar erro se sensor TcAg for associado a uma Pump', async () => {
      const mockMachine = { id: machineId, type: 'Pump' };

      jest
        .spyOn(prisma.machine, 'findUnique')
        .mockResolvedValue(mockMachine as any);

      await expect(
        service.assignSensor({
          model: 'TcAg',
          monitoringPointId: 'S1',
          machineId: 'some-id',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar erro se combinação de tipo e sensor for inválida', async () => {
      const mockMachine = { id: machineId, type: 'Pump' };

      jest
        .spyOn(prisma.machine, 'findUnique')
        .mockResolvedValue(mockMachine as any);

      await expect(
        service.assignSensor({
          model: 'TcAs',
          monitoringPointId: 'S2',
          machineId: 'some-id',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
