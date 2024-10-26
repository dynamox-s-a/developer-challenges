import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Machine, MonitoringPoint } from '@prisma/client';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';
import { MonitoringPointsController } from './monitoring-points.controller';
import { MonitoringPointsService } from './monitoring-points.service';

const machines: Machine[] = [
  {
    id: 3,
    name: 'fake-machine',
    type: 'Pump',
    createdAt: new Date(),
    userId: 1,
  },
  {
    id: 4,
    name: 'fake-machine',
    type: 'Pump',
    createdAt: new Date(),
    userId: 2,
  },
];

class MockMPService {
  private monitoringPoints: MonitoringPoint[] = [];
  private idCounter = 1;

  checkMachine(machineId: number, userId: number) {
    return machines.some(
      (machine) => machine.id === machineId && machine.userId === userId
    );
  }

  async create(
    { machineId, name }: CreateMonitoringPointDto,
    userId: number
  ): Promise<MonitoringPoint | null> {
    const isValidMachine = this.checkMachine(machineId, userId);

    if (!isValidMachine) {
      throw new Error();
    }

    const monitoringPoint = {
      machineId,
      name,
      userId: userId,
      createdAt: new Date(),
      id: this.idCounter++,
    };

    this.monitoringPoints.push(monitoringPoint);

    return Promise.resolve(monitoringPoint);
  }

  findAll(userId: number): Promise<MonitoringPoint[]> {
    return Promise.resolve(
      this.monitoringPoints.filter((mp) => mp.userId === userId)
    );
  }

  remove(
    monitoringPointId: number,
    userId: number
  ): Promise<MonitoringPoint | undefined> {
    const monitoringPoint = this.monitoringPoints.find(
      (mp) => mp.id === monitoringPointId && mp.userId === userId
    );

    if (!monitoringPoint) {
      throw new Error();
    }

    this.monitoringPoints = this.monitoringPoints.filter(
      (mp) => mp.id !== monitoringPointId
    );

    return Promise.resolve(monitoringPoint);
  }
}

describe('MonitoringPointsController', () => {
  const fakeUser = {
    email: 'test@test.com',
    id: 1,
  };

  let controller: MonitoringPointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitoringPointsController],
      providers: [
        {
          provide: MonitoringPointsService,
          useClass: MockMPService,
        },
      ],
    }).compile();

    controller = module.get<MonitoringPointsController>(
      MonitoringPointsController
    );
  });

  describe('create', () => {
    it('should create a monitoring point successfully', async () => {
      const dto: CreateMonitoringPointDto = {
        machineId: 3,
        name: 'Temperature Sensor',
      };
      const result = await controller.create(dto, fakeUser);

      expect(result).toMatchObject({
        id: 1,
        machineId: 3,
        name: 'Temperature Sensor',
        userId: fakeUser.id,
      });
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should throw if the machine is invalid', async () => {
      const dto: CreateMonitoringPointDto = {
        machineId: 999,
        name: 'Pressure Sensor',
      };

      await expect(controller.create(dto, fakeUser)).rejects.toThrow();
    });

    it('should throw if the user does not own the machine', async () => {
      const dto: CreateMonitoringPointDto = {
        machineId: 3,
        name: 'Pressure Sensor',
      };

      const anotherUser = { ...fakeUser, id: 1021 };

      await expect(controller.create(dto, anotherUser)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all monitoring points for a user', async () => {
      const dto: CreateMonitoringPointDto = {
        machineId: 3,
        name: 'Temperature Sensor',
      };

      await controller.create(dto, fakeUser);
      await controller.create(dto, fakeUser);

      await expect(controller.findAll(fakeUser)).resolves.toEqual([
        {
          id: 1,
          machineId: 3,
          name: 'Temperature Sensor',
          userId: fakeUser.id,
          createdAt: expect.any(Date),
        },
        {
          id: 2,
          machineId: 3,
          name: 'Temperature Sensor',
          userId: fakeUser.id,
          createdAt: expect.any(Date),
        },
      ]);
    });

    it('should return an empty array if the user has no monitoring points', async () => {
      await expect(controller.findAll(fakeUser)).resolves.toEqual([]);
    });
  });

  describe('remove', () => {
    it('should remove a monitoring point successfully', async () => {
      const monitoringPointId = 1;
      const removedMonitoringPoint: MonitoringPoint = {
        id: monitoringPointId,
        machineId: 3,
        name: 'Temperature Sensor',
        userId: fakeUser.id,
        createdAt: new Date(),
      };

      await controller.create(
        {
          machineId: removedMonitoringPoint.machineId,
          name: 'Temperature Sensor',
        },
        fakeUser
      );

      await expect(controller.findAll(fakeUser)).resolves.toEqual([
        removedMonitoringPoint,
      ]);
      await expect(
        controller.remove(monitoringPointId, fakeUser)
      ).resolves.toEqual(removedMonitoringPoint);
      await expect(controller.findAll(fakeUser)).resolves.toEqual([]);
    });

    it('should throw if the monitoring point does not exist', async () => {
      const monitoringPointId = 999;

      await expect(
        controller.remove(monitoringPointId, fakeUser)
      ).rejects.toThrow();
    });
  });
});
