import { Test, TestingModule } from '@nestjs/testing';
import { Machine, MonitoringPoint, Sensor, SensorModel } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { SensorService } from './sensor.service';

type PrismaFindParameter = {
  where: {
    id: number;
    userId: number;
  };
  include: {
    machine: boolean;
  };
};

type PrismaUpsertParameter = {
  where: {
    monitoringPointId: number;
  };
  create: {
    model: SensorModel;
    monitoringPointId: number;
  };
  update: {
    model: SensorModel;
  };
};

type MonitoringPointWithMachine = {
  monitoringPoint: MonitoringPoint;
  machine: Machine;
};

const fakeMonitoringPoints: MonitoringPointWithMachine[] = [
  {
    monitoringPoint: {
      createdAt: new Date(),
      id: 1,
      machineId: 5,
      name: 'Test',
      userId: 1,
    },
    machine: {
      type: 'Fan',
      createdAt: new Date(),
      id: 5,
      name: 'Fan Machine',
      userId: 1,
    },
  },
  {
    monitoringPoint: {
      createdAt: new Date(),
      id: 2,
      machineId: 3,
      name: 'Test',
      userId: 2,
    },
    machine: {
      type: 'Pump',
      createdAt: new Date(),
      id: 3,
      name: 'Pump Machine',
      userId: 2,
    },
  },
  {
    monitoringPoint: {
      createdAt: new Date(),
      id: 4,
      machineId: 10,
      name: 'Test',
      userId: 20,
    },
    machine: {
      type: 'Pump',
      createdAt: new Date(),
      id: 10,
      name: 'Pump Machine',
      userId: 20,
    },
  },
];

class MockPrismaService {
  private sensors: Sensor[] = [];
  private idCounter = 1;

  monitoringPoint = {
    findUniqueOrThrow: async (opts: PrismaFindParameter) => {
      const { where: data } = opts;
      const { id, userId } = data;

      const monitoringPoint = fakeMonitoringPoints.find(
        (mp) => mp.monitoringPoint.id === id && mp.machine.userId === userId
      );

      if (!monitoringPoint) {
        throw new Error();
      }

      return monitoringPoint;
    },
  };

  sensor = {
    upsert: async (opts: PrismaUpsertParameter) => {
      const { where, create } = opts;

      const newSensor = {
        model: create.model,
        id: this.idCounter++,
        monitoringPointId: where.monitoringPointId,
      };

      this.sensors.push(newSensor);

      return newSensor;
    },
  };
}

describe('SensorService', () => {
  let service: SensorService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a sensor successfully', async () => {
      const validCreateSensorDto: CreateSensorDto = {
        model: SensorModel.HFPlus,
      };

      // Target with machine of type fan - no constraints
      const target = fakeMonitoringPoints[0];

      const result = await service.create(
        validCreateSensorDto,
        target.monitoringPoint.id,
        target.monitoringPoint.userId
      );
      expect(result).toHaveProperty('id');
      expect(result.model).toBe(validCreateSensorDto.model);
      expect(result.monitoringPointId).toBe(target.monitoringPoint.id);
    });

    it('should throw if monitoring point does not exist', async () => {
      const validCreateSensorDto: CreateSensorDto = {
        model: SensorModel.HFPlus,
      };
      const nonExistentMonitoringPointId = 999;
      await expect(
        service.create(validCreateSensorDto, nonExistentMonitoringPointId, 1)
      ).rejects.toThrow();
    });

    it('should throw if sensor model is not allowed for machine type', async () => {
      const invalidCreateSensorDto = {
        model: 'TcAg',
      } as CreateSensorDto;

      // target of type pump, only accepts HFPlus sensor type;
      const target = fakeMonitoringPoints[1];

      await expect(
        service.create(
          invalidCreateSensorDto,
          target.monitoringPoint.id,
          target.machine.userId
        )
      ).rejects.toThrow();
    });

    it('should throw if monitoring point does not belong to the user', async () => {
      const validCreateSensorDto: CreateSensorDto = {
        model: SensorModel.HFPlus,
      };
      const target = fakeMonitoringPoints[1];
      await expect(
        service.create(
          validCreateSensorDto,
          target.monitoringPoint.id,
          target.machine.userId + 1
        )
      ).rejects.toThrow();
    });
  });
});
