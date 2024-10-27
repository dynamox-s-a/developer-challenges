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
    machineId: number,
    userId: number,
    { name }: CreateMonitoringPointDto
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

  remove(
    machineId: number,
    monitoringPointId: number,
    userId: number
  ): Promise<MonitoringPoint | undefined> {
    const monitoringPoint = this.monitoringPoints.find(
      (mp) =>
        mp.id === monitoringPointId &&
        mp.userId === userId &&
        mp.machineId === machineId
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
        name: 'Temperature Sensor',
      };
      const result = await controller.create(3, fakeUser, dto);

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
        name: 'Pressure Sensor',
      };

      await expect(controller.create(999, fakeUser, dto)).rejects.toThrow();
    });

    it('should throw if the user does not own the machine', async () => {
      const dto: CreateMonitoringPointDto = {
        name: 'Pressure Sensor',
      };

      const anotherUser = { ...fakeUser, id: 1021 };

      await expect(controller.create(3, anotherUser, dto)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove a monitoring point successfully', async () => {
      const removedMonitoringPoint: MonitoringPoint = {
        id: 1,
        machineId: 3,
        name: 'Temperature Sensor',
        userId: fakeUser.id,
        createdAt: new Date(),
      };

      await controller.create(removedMonitoringPoint.machineId, fakeUser, {
        name: 'Temperature Sensor',
      });

      await expect(
        controller.remove(
          removedMonitoringPoint.machineId,
          removedMonitoringPoint.id,
          fakeUser
        )
      ).resolves.toEqual(removedMonitoringPoint);
    });

    it('should throw if the monitoring point does not exist', async () => {
      await expect(controller.remove(3, 999, fakeUser)).rejects.toThrow();
    });

    it('should throw if the monitoring point belongs to a machine the user does not own', async () => {
      // Create a monitoring point first
      await controller.create(3, fakeUser, {
        name: 'Temperature Sensor',
      });

      // Try to remove it with a different user
      const anotherUser = { ...fakeUser, id: 2 };
      await expect(controller.remove(3, 1, anotherUser)).rejects.toThrow();
    });
  });
});
