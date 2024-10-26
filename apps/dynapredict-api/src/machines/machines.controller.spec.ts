import { Test, TestingModule } from '@nestjs/testing';
import { Machine } from '@prisma/client';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';

class MockMachinesService {
  private machines: Machine[] = [];
  private counter = 1;

  create(machineData: CreateMachineDto, userId: number): Promise<Machine> {
    const machine = {
      ...machineData,
      userId: userId,
      createdAt: new Date(),
      id: this.counter++,
    };

    this.machines.push(machine);

    return Promise.resolve(machine);
  }

  findAll(userId: number): Promise<Machine[]> {
    return Promise.resolve(
      this.machines.filter((machine) => machine.userId === userId)
    );
  }

  findOne(machineId: number, userId: number): Promise<Machine> {
    const machine = this.machines.find(
      (machine) => machine.id === machineId && machine.userId === userId
    );
    if (!machine) throw new Error();
    return Promise.resolve(machine);
  }

  update(
    machineId: number | string,
    userId: number,
    machineData: UpdateMachineDto
  ): Promise<Machine | null> {
    const index = this.machines.findIndex(
      (machine) => machine.id === machineId && machine.userId === userId
    );

    if (index === -1) {
      throw new Error();
    }

    this.machines = this.machines.map((machine, idx) => {
      if (idx === index) {
        return {
          ...machine,
          ...machineData,
        };
      }
      return machine;
    });

    return Promise.resolve(this.machines[index]);
  }

  remove(machineId: number, userId: number): Promise<Machine> {
    const machine = this.machines.find(
      (machine) => machine.id === machineId && machine.userId === userId
    );

    if (!machine) {
      throw new Error();
    }

    this.machines = this.machines.filter((machine) => machine.id !== machineId);

    return Promise.resolve(machine);
  }
}

describe('MachinesController', () => {
  const fakeUser = {
    email: 'test@test.com',
    id: 5,
  };

  const anotherUser = {
    email: 'another@test.com',
    id: 6,
  };

  let controller: MachinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachinesController],
      providers: [
        {
          provide: MachinesService,
          useClass: MockMachinesService,
        },
      ],
    }).compile();

    controller = module.get<MachinesController>(MachinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create Machine', () => {
    it('should create a machine for the user', async () => {
      const createDto: CreateMachineDto = {
        name: 'Machine A',
        type: 'Pump',
      };

      const machine = await controller.create(createDto, fakeUser);

      expect(machine).toHaveProperty('id');
      expect(machine.name).toBe(createDto.name);
      expect(machine.type).toBe(createDto.type);
      expect(machine.userId).toBe(fakeUser.id);
    });
  });

  describe('Get All Machines', () => {
    it('should return all machines for the user', async () => {
      await controller.create({ name: 'Machine B', type: 'Fan' }, fakeUser);
      await controller.create({ name: 'Machine C', type: 'Pump' }, fakeUser);

      await controller.create({ name: 'Machine D', type: 'Fan' }, anotherUser);

      const machines = await controller.findAll(fakeUser);
      expect(machines.length).toBe(2);
      machines.forEach((machine) => {
        expect(machine.userId).toBe(fakeUser.id);
      });
    });
  });

  describe('Get Single Machine', () => {
    it('should return the machine if it belongs to the user', async () => {
      const createDto: CreateMachineDto = {
        name: 'Machine E',
        type: 'Fan',
      };

      const createdMachine = await controller.create(createDto, fakeUser);

      const machine = await controller.findOne(createdMachine.id, fakeUser);

      expect(machine).toBeDefined();
      expect(machine.id).toBe(createdMachine.id);
      expect(machine.name).toBe(createDto.name);
    });

    it("should throw Not Found if the machine doesn't belong to the user", async () => {
      const createDto: CreateMachineDto = {
        name: 'Machine F',
        type: 'Fan',
      };

      const createdMachine = await controller.create(createDto, fakeUser);

      await expect(
        controller.findOne(createdMachine.id, anotherUser)
      ).rejects.toThrow();
    });
  });

  describe('Update Machine', () => {
    it('should update the machine if it belongs to the user', async () => {
      const createDto: CreateMachineDto = {
        name: 'Machine G',
        type: 'Pump',
      };

      const createdMachine = await controller.create(createDto, fakeUser);

      const updateDto: UpdateMachineDto = {
        name: 'Machine G Updated',
      };

      const updatedMachine = await controller.update(
        createdMachine.id,
        fakeUser,
        updateDto
      );

      expect(updatedMachine).toBeDefined();
      expect(updatedMachine.name).toBe(updateDto.name);
    });

    it("should not update the machine if it doesn't belong to the user", async () => {
      const createDto: CreateMachineDto = {
        name: 'Machine H',
        type: 'Fan',
      };

      const createdMachine = await controller.create(createDto, fakeUser);

      const updateDto: UpdateMachineDto = {
        name: 'Machine H Updated',
      };

      await expect(
        controller.update(createdMachine.id, anotherUser, updateDto)
      ).rejects.toThrow();
    });
  });

  describe('Delete Machine', () => {
    it('should delete the machine if it belongs to the user', async () => {
      const createDto: CreateMachineDto = {
        name: 'Machine I',
        type: 'Pump',
      };

      const createdMachine = await controller.create(createDto, fakeUser);

      const deletedMachine = await controller.remove(
        createdMachine.id,
        fakeUser
      );

      expect(deletedMachine).toBeDefined();
      expect(deletedMachine.id).toBe(createdMachine.id);

      const machines = await controller.findAll(fakeUser);
      expect(
        machines.find((machine) => machine.id === createdMachine.id)
      ).toBeUndefined();
    });

    it("should not delete the machine if it doesn't belong to the user", async () => {
      const createDto: CreateMachineDto = {
        name: 'Machine J',
        type: 'Fan',
      };

      const createdMachine = await controller.create(createDto, fakeUser);

      await expect(
        controller.remove(createdMachine.id, anotherUser)
      ).rejects.toThrow();

      const machines = await controller.findAll(fakeUser);
      expect(
        machines.find((machine) => machine.id === createdMachine.id)
      ).toBeDefined();
    });
  });
});
