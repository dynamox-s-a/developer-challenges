import { Test, TestingModule } from '@nestjs/testing';
import { Machine, MonitoringPoint } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { MachinesService } from '../machines/machines.service';
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

class MockMachinesService {
  async findOne(machineId: number, userId: number): Promise<Machine | null> {
    return (
      machines.find(
        (machine) => machine.id === machineId && machine.userId === userId
      ) ?? null
    );
  }
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
        {
          provide: MachinesService,
          useClass: MockMachinesService,
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
        machineId: machines[0].id,
      };

      const result = await service.create(fakePoint, fakeUser.id);

      expect(result).toEqual(
        expect.objectContaining({
          name: fakePoint.name,
          machineId: fakePoint.machineId,
          userId: fakeUser.id,
          id: expect.any(Number),
        })
      );
    });

    it('should NOT create a monitoring point when we have a machine that DOES NOT belong to the user', async () => {
      const fakePoint: CreateMonitoringPointDto = {
        name: 'Test Point',
        machineId: machines[1].id,
      };

      const result = await service.create(fakePoint, fakeUser.id);

      expect(result).toEqual(null);
    });

    it('should NOT create a monitoring point when do not have an existing machine', async () => {
      const fakePoint: CreateMonitoringPointDto = {
        name: 'Test Point',
        machineId: 20,
      };

      const result = await service.create(fakePoint, fakeUser.id);

      expect(result).toEqual(null);
    });

    it('should NOT create a monitoring point with a non-existent userId', async () => {
      const fakePoint: CreateMonitoringPointDto = {
        name: 'Test Point',
        machineId: machines[0].id,
      };

      const result = await service.create(fakePoint, 999);

      expect(result).toEqual(null);
    });
  });
});
