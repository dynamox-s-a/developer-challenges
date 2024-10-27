import { Test, TestingModule } from '@nestjs/testing';
import { Machine } from '@prisma/client';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';

class MockMachinesService {
  create = jest.fn();
  findAll = jest.fn();
  findOne = jest.fn();
  update = jest.fn();
  remove = jest.fn();
}

describe('Machines Controller', () => {
  let controller: MachinesController;
  let service: MockMachinesService;

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
    service = module.get<MockMachinesService>(MachinesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('It should create a machine - POST route', () => {
    it('should create a machine with correct parameters', async () => {
      const fakeUser = {
        email: 'test@test.com',
        id: 5,
      };
      const createDto: CreateMachineDto = {
        name: 'Machine A',
        type: 'Pump',
      };

      service.create.mockReturnValue({
        id: 1,
        name: createDto.name,
        type: createDto.type,
        userId: fakeUser.id,
      });

      const machine = await controller.create(createDto, fakeUser);

      expect(service.create).toHaveBeenCalledWith(createDto, fakeUser.id);
      expect(machine).toEqual({
        id: 1,
        name: createDto.name,
        type: createDto.type,
        userId: fakeUser.id,
      });
    });
  });

  describe('It should return all machines or an empty array - GET Route', () => {
    it('should return empty array if no machines are available', async () => {
      const fakeUser = {
        email: 'test@test.com',
        id: 5,
      };

      service.findAll.mockReturnValue([]);
      const result = await controller.findAll(fakeUser);

      expect(result).toMatchObject([]);
      expect(service.findAll).toHaveBeenCalledWith(fakeUser.id);
    });
    it('should return machines array if there are some created', async () => {
      const fakeUser = {
        email: 'test@test.com',
        id: 5,
      };
      const createDto: CreateMachineDto = {
        name: 'Machine A',
        type: 'Pump',
      };

      const expectedResult = [
        {
          id: 1,
          name: createDto.name,
          type: createDto.type,
          userId: fakeUser.id,
        },
        {
          id: 2,
          name: createDto.name,
          type: createDto.type,
          userId: fakeUser.id,
        },
      ];

      service.findAll.mockReturnValue(expectedResult);

      const result = await controller.findAll(fakeUser);

      expect(result).toMatchObject(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(fakeUser.id);
    });
  });

  describe('It should return a single machine - GET Machine Route', () => {
    it('Should return the machine if it was found', async () => {
      const fakeUser = {
        email: 'test@test.com',
        id: 5,
      };
      const machine: Machine = {
        id: 2,
        createdAt: new Date(),
        name: 'Machine A',
        type: 'Pump',
        userId: 5,
      };
      service.findOne.mockReturnValue(machine);

      const result = await controller.findOne(machine.id, fakeUser);

      expect(result).toMatchObject(machine);
      expect(service.findOne).toHaveBeenCalledWith(machine.id, fakeUser.id);
    });

    describe('it should throw if no one is found', () => {
      it('should throw an error when machine is not found', async () => {
        const fakeUser = {
          email: 'test@test.com',
          id: 5,
        };
        const machine: Machine = {
          id: 2,
          createdAt: new Date(),
          name: 'Machine A',
          type: 'Pump',
          userId: 5,
        };
        service.findOne.mockRejectedValue(new Error('Machine not found'));

        await expect(
          controller.findOne(machine.id + 1, fakeUser)
        ).rejects.toThrow('Machine not found');
      });
    });
  });

  describe('It should update and return the updated machine - PATCH machine route', () => {
    it('should return the updated machine with new data', async () => {
      const fakeUser = {
        email: 'test@test.com',
        id: 5,
      };
      const machine: Machine = {
        id: 2,
        createdAt: new Date(),
        name: 'Machine A',
        type: 'Pump',
        userId: 5,
      };
      const updateData: UpdateMachineDto = {
        name: 'Machine A+',
        type: 'Pump',
      };

      service.update.mockReturnValue({ ...machine, ...updateData });

      const result = await controller.update(machine.id, fakeUser, updateData);
      expect(result).toMatchObject({ ...machine, ...updateData });
      expect(service.update).toHaveBeenCalledWith(
        machine.id,
        fakeUser.id,
        updateData
      );
    });
    it('should throw an error if invalid userId/machine', async () => {
      const fakeUser = {
        email: 'test@test.com',
        id: 5,
      };
      const updateData: UpdateMachineDto = {
        name: 'Machine A+',
        type: 'Pump',
      };

      service.update.mockRejectedValue(new Error('Invalid machine id'));

      await expect(
        controller.update(999, fakeUser, updateData)
      ).rejects.toThrow('Invalid machine id');
    });
  });
  describe('It should delete a machine - DELETE route', () => {
    it('should delete the machine with the provided id', async () => {
      const fakeUser = {
        email: 'test@test.com',
        id: 5,
      };
      const machine: Machine = {
        id: 2,
        createdAt: new Date(),
        name: 'Machine A',
        type: 'Pump',
        userId: 5,
      };

      service.remove.mockReturnValue(machine);

      const result = await controller.remove(machine.id, fakeUser);
      expect(result).toMatchObject(machine);
      expect(service.remove).toHaveBeenCalledWith(machine.id, fakeUser.id);
    });
    it('should throw error if invalid machine id', async () => {
      const fakeUser = {
        email: 'test@test.com',
        id: 5,
      };

      service.remove.mockRejectedValue(new Error('Machine not found'));

      await expect(controller.remove(999, fakeUser)).rejects.toThrow(
        'Machine not found'
      );
    });
  });
});
