import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../db/prisma.service';
import { ALLOWED_SENSORS } from '../sensor/sensor.service';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { MachinesService } from './machines.service';

const mockMachines = [
  {
    id: 1,
    name: 'Pump 1',
    type: 'Pump',
    userId: 1,
    monitoringPoints: [
      {
        id: 1,
        sensor: { model: ALLOWED_SENSORS['Pump'][0] },
      },
      {
        id: 2,
        sensor: { model: ALLOWED_SENSORS['Pump'][0] },
      },
    ],
  },
  {
    id: 2,
    name: 'Fan 1',
    type: 'Fan',
    userId: 1,
    monitoringPoints: [
      {
        id: 3,
        sensor: { model: ALLOWED_SENSORS['Fan'][1] },
      },
    ],
  },
];

class MockPrismaService {
  machine = {
    findUniqueOrThrow: ({ where }) => {
      const machine = mockMachines.find(
        (m) => m.id === where.id && m.userId === where.userId
      );
      if (machine) {
        return Promise.resolve(machine);
      }
      throw new Error();
    },
    update: ({ where, data }) => {
      const machineIndex = mockMachines.findIndex(
        (m) => m.id === where.id && m.userId === where.userId
      );
      if (machineIndex === -1) {
        throw new Error();
      }
      mockMachines[machineIndex] = {
        ...mockMachines[machineIndex],
        ...data,
      };
      return Promise.resolve(mockMachines[machineIndex]);
    },
  };
}

describe('MachinesService', () => {
  let service: MachinesService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('should successfully update the machine type when new type is supported by current sensors', async () => {
      // Pump to Fan = no constraints, should be ok
      const target = mockMachines[0];
      const updateDto: UpdateMachineDto = {
        type: 'Fan',
      };
      const updatedMachine = await service.update(
        target.id,
        target.userId,
        updateDto
      );
      expect(updatedMachine.type).toBe('Fan');
    });

    it('should throw when new type is not supported by current sensors', async () => {
      // Fan to Pump = has constraints, and currently this mock target has unsupported sensor
      const target = mockMachines[1];
      const updateDto: UpdateMachineDto = {
        type: 'Pump',
      };
      await expect(
        service.update(target.id, target.userId, updateDto)
      ).rejects.toThrow();
    });

    it('should throw NotFoundException when the machine does not exist', async () => {
      const updateDto: UpdateMachineDto = {
        type: 'Pump',
      };
      await expect(service.update(999, 1, updateDto)).rejects.toThrow();
    });
  });
});
