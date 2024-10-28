import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../db/prisma.service';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';
import { QueryDto } from './get-all/query.dto';
import { MonitoringPointsService } from './monitoring-points.service';

class MockPrismaService {
  monitoringPoint = {
    create: jest.fn(),
    delete: jest.fn(),
  };
  user = {
    findUnique: jest.fn(),
  };
}

describe('MonitoringPointsService', () => {
  let service: MonitoringPointsService;
  let prisma: MockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitoringPointsService,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MonitoringPointsService>(MonitoringPointsService);
    prisma = module.get<MockPrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should successfully create a monitoring point', async () => {
      const machineId = 1;
      const userId = 1;
      const dto: CreateMonitoringPointDto = { name: 'MP for Pump' };
      const mockMonitoringPoint = { id: 1, name: 'MP for Pump' };

      prisma.monitoringPoint.create.mockResolvedValue(mockMonitoringPoint);

      const result = await service.create(machineId, userId, dto);

      expect(prisma.monitoringPoint.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          machine: { connect: { id: machineId, userId } },
          user: { connect: { id: userId } },
        },
      });
      expect(result).toEqual(mockMonitoringPoint);
    });

    it('should throw NotFoundException when Prisma P2025 error occurs', async () => {
      const machineId = 1;
      const userId = 1;
      const dto: CreateMonitoringPointDto = { name: 'MP for Pump' };
      const prismaError = { code: 'P2025' };

      prisma.monitoringPoint.create.mockRejectedValue(prismaError);

      await expect(service.create(machineId, userId, dto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should rethrow unexpected errors', async () => {
      const machineId = 1;
      const userId = 1;
      const dto: CreateMonitoringPointDto = { name: 'MP for Pump' };
      const prismaError = new Error('Unexpected error');

      prisma.monitoringPoint.create.mockRejectedValue(prismaError);

      await expect(service.create(machineId, userId, dto)).rejects.toThrow(
        prismaError
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated monitoring points', async () => {
      const query: QueryDto = {
        page: 2,
        sortBy: 'machine_name',
        sortOrder: 'desc',
      };
      const userId = 1;
      const mockMonitoringPoints = [
        {
          id: 2,
          name: 'Point B',
          machine: { name: 'Machine A' },
          sensor: { model: 'Model X' },
        },
        {
          id: 3,
          name: 'Point C',
          machine: { name: 'Machine B' },
          sensor: { model: 'Model Y' },
        },
        {
          id: 4,
          name: 'Point D',
          machine: { name: 'Machine C' },
          sensor: { model: 'Model Z' },
        },
      ];
      const mockCount = { monitoringPoints: 10 };

      prisma.user.findUnique.mockResolvedValue({
        monitoringPoints: mockMonitoringPoints,
        _count: mockCount,
      });

      const result = await service.findAll(query, userId);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          monitoringPoints: {
            skip: 5,
            take: 5,
            orderBy: { machine: { name: 'desc' } },
            include: { machine: true, sensor: true },
          },
          _count: { select: { monitoringPoints: true } },
        },
      });

      expect(result).toEqual({
        data: mockMonitoringPoints,
        total: mockCount.monitoringPoints,
        page: 2,
        totalPages: 2,
      });
    });

    it('should use default pagination and sorting when query params are missing', async () => {
      const query: QueryDto = {};
      const userId = 1;
      const mockMonitoringPoints = [
        {
          id: 1,
          name: 'Point A',
          machine: { name: 'Machine A' },
          sensor: { model: 'Model Y' },
        },
        {
          id: 2,
          name: 'Point B',
          machine: { name: 'Machine B' },
          sensor: { model: 'Model X' },
        },
        {
          id: 3,
          name: 'Point C',
          machine: { name: 'Machine C' },
          sensor: { model: 'Model Z' },
        },
        {
          id: 4,
          name: 'Point D',
          machine: { name: 'Machine D' },
          sensor: { model: 'Model W' },
        },
      ];
      const mockCount = { monitoringPoints: 4 };

      prisma.user.findUnique.mockResolvedValue({
        monitoringPoints: mockMonitoringPoints,
        _count: mockCount,
      });

      const result = await service.findAll(query, userId);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          monitoringPoints: {
            skip: 0,
            take: 5,
            orderBy: { machine: { name: 'asc' } },
            include: { machine: true, sensor: true },
          },
          _count: { select: { monitoringPoints: true } },
        },
      });

      expect(result).toEqual({
        data: mockMonitoringPoints,
        total: mockCount.monitoringPoints,
        page: 1,
        totalPages: 1,
      });
    });
  });

  describe('remove', () => {
    it('should successfully remove a monitoring point', async () => {
      const machineId = 1;
      const userId = 1;
      const monitoringPointId = 1;
      const mockDeletedPoint = { id: monitoringPointId, name: 'Point A' };

      prisma.monitoringPoint.delete.mockResolvedValue(mockDeletedPoint);

      const result = await service.remove(machineId, userId, monitoringPointId);

      expect(prisma.monitoringPoint.delete).toHaveBeenCalledWith({
        where: { machineId, userId, id: monitoringPointId },
      });
      expect(result).toEqual(mockDeletedPoint);
    });

    it('should throw NotFoundException when Prisma P2025 error occurs', async () => {
      const machineId = 1;
      const userId = 1;
      const monitoringPointId = 1;
      const prismaError = { code: 'P2025' };

      prisma.monitoringPoint.delete.mockRejectedValue(prismaError);

      await expect(
        service.remove(machineId, userId, monitoringPointId)
      ).rejects.toThrow(NotFoundException);
    });

    it('should rethrow unexpected errors', async () => {
      const machineId = 1;
      const userId = 1;
      const monitoringPointId = 1;
      const prismaError = new Error('Unexpected error');

      prisma.monitoringPoint.delete.mockRejectedValue(prismaError);

      await expect(
        service.remove(machineId, userId, monitoringPointId)
      ).rejects.toThrow(prismaError);
    });
  });
});
