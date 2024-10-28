import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MachineType, Sensor, SensorModel } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { SensorService } from './sensor.service';

class MockPrismaService {
  monitoringPoint = {
    findUniqueOrThrow: jest.fn(),
  };
  sensor = {
    upsert: jest.fn(),
  };
}

describe('SensorService', () => {
  let service: SensorService;
  let prisma: MockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorService,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SensorService>(SensorService);
    prisma = module.get<MockPrismaService>(PrismaService);
  });

  describe('create sensor', () => {
    const createSensorDto: CreateSensorDto = { model: SensorModel.HFPlus };
    const monitoringPointId = 1;
    const userId = 1;
    const machineType: MachineType = MachineType.Pump;

    it('should successfully create a sensor', async () => {
      const mockMonitoringPoint = {
        machine: { type: machineType },
      };

      const mockSensor: Sensor = {
        id: 1,
        model: createSensorDto.model,
        monitoringPointId,
      };

      prisma.monitoringPoint.findUniqueOrThrow.mockResolvedValue(
        mockMonitoringPoint
      );

      prisma.sensor.upsert.mockResolvedValue(mockSensor);

      const result = await service.create(
        createSensorDto,
        monitoringPointId,
        userId
      );

      expect(prisma.monitoringPoint.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: monitoringPointId, userId },
        include: { machine: true },
      });

      expect(prisma.sensor.upsert).toHaveBeenCalledWith({
        where: { monitoringPointId },
        update: { model: createSensorDto.model },
        create: {
          model: createSensorDto.model,
          monitoringPoint: { connect: { id: monitoringPointId } },
        },
      });

      expect(result).toEqual(mockSensor);
    });

    it('should throw BadRequestException for invalid sensor model and machine type', async () => {
      const invalidModel: SensorModel = 'TcAg';
      const mockMonitoringPoint = {
        machine: { type: machineType },
      };

      const invalidDto = { model: invalidModel };

      prisma.monitoringPoint.findUniqueOrThrow.mockResolvedValue(
        mockMonitoringPoint
      );

      await expect(
        service.create(invalidDto, monitoringPointId, userId)
      ).rejects.toThrow(
        new BadRequestException(
          `This model: ${invalidModel} is incompatible with this monitoring point's machine: ${machineType}`
        )
      );

      expect(prisma.sensor.upsert).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when Prisma throws P2025 error', async () => {
      const prismaError = { code: 'P2025' };
      prisma.monitoringPoint.findUniqueOrThrow.mockRejectedValue(prismaError);

      await expect(
        service.create(createSensorDto, monitoringPointId, userId)
      ).rejects.toThrow(NotFoundException);

      expect(prisma.sensor.upsert).not.toHaveBeenCalled();
    });
  });
});
