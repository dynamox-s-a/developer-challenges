import { Test, TestingModule } from '@nestjs/testing';
import { Machine, MonitoringPoint } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';
import { MonitoringPointsService } from './monitoring-points.service';

type Data = {
  name: string;
  machine: {
    connect: {
      id: number;
    };
  };
  user: {
    connect: {
      id: number;
    };
  };
};

type PrismaParameter = {
  data: Data;
};

const fakeUser = {
  id: 1,
  email: 'test@gmail.com',
};

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

class MockPrismaService {
  private points: MonitoringPoint[] = [];
  private idCounter = 1;

  monitoringPoint = {
    create: async ({ data }: PrismaParameter) => {
      const {
        name,
        user: {
          connect: { id: userId },
        },
        machine: {
          connect: { id: machineId },
        },
      } = data;

      if (
        !machines.some(
          (machine) => machine.id === machineId && machine.userId === userId
        )
      ) {
        throw new Error();
      }

      const monitoringPoint = {
        id: this.idCounter++,
        name,
        userId,
        machineId,
        createdAt: new Date(),
      };

      this.points.push(monitoringPoint);

      return monitoringPoint;
    },
  };
}

describe('MonitoringPointsService', () => {
  let service: MonitoringPointsService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a monitoring point when we have a machine that belongs to the user', async () => {
      const fakePoint: CreateMonitoringPointDto = {
        name: 'Test Point',
      };

      const result = await service.create(
        machines[0].id,
        fakeUser.id,
        fakePoint
      );

      expect(result).toEqual(
        expect.objectContaining({
          name: fakePoint.name,
          machineId: machines[0].id,
          userId: fakeUser.id,
          id: expect.any(Number),
        })
      );
    });

    it('should NOT create a monitoring point when we have a machine that DOES NOT belong to the user', async () => {
      const fakePoint: CreateMonitoringPointDto = {
        name: 'Test Point',
      };

      await expect(
        service.create(machines[1].id, fakeUser.id, fakePoint)
      ).rejects.toThrow();
    });

    it('should NOT create a monitoring point when do not have an existing machine', async () => {
      const fakePoint: CreateMonitoringPointDto = {
        name: 'Test Point',
      };

      await expect(
        service.create(20, fakeUser.id, fakePoint)
      ).rejects.toThrow();
    });

    it('should NOT create a monitoring point with a non-existent userId', async () => {
      const fakePoint: CreateMonitoringPointDto = {
        name: 'Test Point',
      };

      await expect(
        service.create(machines[0].id, 999, fakePoint)
      ).rejects.toThrow();
    });
  });
});
