import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Machine, MachineType, Sensor, User } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { MachinesService } from './machines.service';

class MockPrismaService {
  machine = {
    create: jest.fn(),
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

describe('MachinesService', () => {
  const fakeUser: Omit<User, 'password'> = {
    id: 1,
    email: 'test@test.com',
    createdAt: new Date(),
  };

  const mockMachine: Machine = {
    id: 1,
    name: 'Test Machine',
    type: MachineType.Pump,
    userId: 1,
    createdAt: new Date(),
  };

  const mockSensor: Sensor = {
    id: 1,
    monitoringPointId: 1,
    model: 'HFPlus',
  };

  let service: MachinesService;
  let prismaService: MockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MachinesService,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MachinesService>(MachinesService);
    prismaService = module.get<MockPrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should successfully create a machine', async () => {
      const createDto: CreateMachineDto = {
        name: 'New Machine',
        type: MachineType.Fan,
      };

      const createdMachine = {
        ...mockMachine,
        ...createDto,
      };

      prismaService.machine.create.mockResolvedValue(createdMachine);

      const result = await service.create(createDto, fakeUser.id);

      expect(result).toEqual(createdMachine);
      expect(prismaService.machine.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          user: {
            connect: { id: fakeUser.id },
          },
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all machines for a specific user', async () => {
      prismaService.machine.findMany.mockResolvedValue([mockMachine]);

      const result = await service.findAll(mockMachine.userId);

      expect(result).toEqual([mockMachine]);
      expect(prismaService.machine.findMany).toHaveBeenCalledWith({
        where: { userId: mockMachine.userId },
      });
    });
  });

  describe('findOne', () => {
    it('should return a machine if found', async () => {
      prismaService.machine.findUniqueOrThrow.mockResolvedValue(mockMachine);

      const result = await service.findOne(mockMachine.id, mockMachine.userId);

      expect(result).toEqual(mockMachine);
      expect(prismaService.machine.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: mockMachine.id, userId: mockMachine.userId },
      });
    });

    it('should throw NotFoundException if machine does not exist', async () => {
      prismaService.machine.findUniqueOrThrow.mockRejectedValue({
        code: 'P2025',
      });

      await expect(service.findOne(999, mockMachine.userId)).rejects.toThrow(
        NotFoundException
      );
      expect(prismaService.machine.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 999, userId: mockMachine.userId },
      });
    });
  });

  describe('update', () => {
    const updateDto: UpdateMachineDto = {
      name: 'Updated Machine',
      type: MachineType.Pump,
    };

    it('should update a machine successfully without type change', async () => {
      const existingMachine = { ...mockMachine };
      const updatedMachine = { ...existingMachine, ...updateDto };

      prismaService.machine.findUniqueOrThrow.mockResolvedValue(
        existingMachine
      );
      prismaService.machine.update.mockResolvedValue(updatedMachine);

      const result = await service.update(
        mockMachine.id,
        mockMachine.userId,
        updateDto
      );

      expect(result).toEqual(updatedMachine);
      expect(prismaService.machine.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: mockMachine.id, userId: mockMachine.userId },
        include: { monitoringPoints: { include: { sensor: true } } },
      });
      expect(prismaService.machine.update).toHaveBeenCalledWith({
        data: updateDto,
        where: { id: mockMachine.id, userId: mockMachine.userId },
      });
    });

    it('should update machine type when compatible sensors are present', async () => {
      const existingMachine = {
        ...mockMachine,
        monitoringPoints: [{ id: 1, sensor: mockSensor }],
      };

      const updateTypeDto: UpdateMachineDto = { type: MachineType.Fan };

      prismaService.machine.findUniqueOrThrow.mockResolvedValue(
        existingMachine
      );
      prismaService.machine.update.mockResolvedValue({
        ...existingMachine,
        ...updateTypeDto,
      });

      const result = await service.update(
        mockMachine.id,
        mockMachine.userId,
        updateTypeDto
      );

      expect(result.type).toBe(MachineType.Fan);
      expect(prismaService.machine.update).toHaveBeenCalledWith({
        data: updateTypeDto,
        where: { id: mockMachine.id, userId: mockMachine.userId },
      });
    });

    it('should throw ConflictException when changing machine type with incompatible sensors', async () => {
      const incompatibleMachine = {
        ...mockMachine,
        type: 'Fan',
        monitoringPoints: [{ id: 1, sensor: { ...mockSensor, model: 'TcAg' } }],
      };

      const updateTypeDto: UpdateMachineDto = { type: MachineType.Pump };

      prismaService.machine.findUniqueOrThrow.mockResolvedValue(
        incompatibleMachine
      );

      await expect(
        service.update(mockMachine.id, mockMachine.userId, updateTypeDto)
      ).rejects.toThrow(ConflictException);

      expect(prismaService.machine.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if machine to update does not exist', async () => {
      prismaService.machine.findUniqueOrThrow.mockRejectedValue({
        code: 'P2025',
      });

      await expect(
        service.update(999, mockMachine.userId, { name: 'New Name' })
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.machine.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should successfully delete a machine', async () => {
      prismaService.machine.delete.mockResolvedValue(mockMachine);

      const result = await service.remove(mockMachine.id, mockMachine.userId);

      expect(result).toEqual(mockMachine);
      expect(prismaService.machine.delete).toHaveBeenCalledWith({
        where: { id: mockMachine.id, userId: mockMachine.userId },
      });
    });

    it('should throw NotFoundException if machine to delete does not exist', async () => {
      prismaService.machine.delete.mockRejectedValue({ code: 'P2025' });

      await expect(service.remove(999, mockMachine.userId)).rejects.toThrow(
        NotFoundException
      );

      expect(prismaService.machine.delete).toHaveBeenCalledWith({
        where: { id: 999, userId: mockMachine.userId },
      });
    });
  });
});
