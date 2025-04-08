import { Test } from '@nestjs/testing';
import { MachinesService } from './machines.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MachinesService', () => {
  let service: MachinesService;
  let prisma: PrismaService;

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
      ],
    }).compile();

    service = module.get<MachinesService>(MachinesService);
    prisma = module.get<PrismaService>(PrismaService);
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
});
