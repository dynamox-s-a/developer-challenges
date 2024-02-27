import { HttpStatus } from '@nestjs/common';
import { JwtStrategy } from '../guard/jwt.strategy';
import { MachinesService } from './machines.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/PrismaService';

const fakeMachines = [
  {
    id: 1,
    name: 'Machine 1',
    type: 'Pump',
    userId: 1,
  },
  {
    id: 2,
    name: 'Machine 2',
    type: 'Pump',
    userId: 1,
  },
  {
    id: 3,
    name: 'Machine 3',
    type: 'Fan',
    userId: 1,
  },
];

const prismaMock = {
  machine: {
    create: jest.fn().mockReturnValue(fakeMachines[1]),
    findUnique: jest.fn().mockImplementation(args => {
      if (args.where.id >= fakeMachines.length) {
        return null;
      }
      return fakeMachines[0];
    }),
    findFirst: jest.fn().mockImplementation(args => {
      if (args.where.id >= fakeMachines.length) {
        return null;
      }
      return fakeMachines[0];
    }),
    findMany: jest.fn().mockResolvedValue(fakeMachines),
    update: jest.fn().mockResolvedValue(fakeMachines[0]),
    delete: jest.fn(),
  },
};

describe('MachinesService', () => {
  const userId = 1;
  let service: MachinesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        MachinesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<MachinesService>(MachinesService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should create a machine', async () => {
    const machine = await service.create({ name: 'Machine 1', type: 'Pump' }, userId);
    expect(machine).toEqual({
      statusCode: HttpStatus.CREATED,
      data: { id: 2, name: 'Machine 2', type: 'Pump' },
    });
    expect(prisma.machine.create).toHaveBeenCalledWith({
      data: {
        name: 'Machine 1',
        type: 'Pump',
        user: {
          connect: {
            id: userId
          }
        }
      }
    });
    expect(prisma.machine.create).toHaveBeenCalledTimes(1);
  });

  it('should not create a machine with wrong type', async () => {
    const machine = await service.create({ name: 'Machine 1', type: 'Wrong' }, userId);
    expect(machine).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      data: "Invalid value for attribute 'type' - Message: Invalid input",
    });
    expect(prisma.machine.create).not.toHaveBeenCalled();
  });

  it('should find a machine', async () => {
    const machine = await service.findOne(1, userId);
    expect(machine).toEqual({
      statusCode: HttpStatus.OK,
      data: {
        id: fakeMachines[0].id,
        name: fakeMachines[0].name,
        type: fakeMachines[0].type
      },
    });
    expect(prisma.machine.findFirst).toHaveBeenCalledWith({
      where: { id: 1, userId },
      select: { id: true, name: true, type: true }
    });
    expect(prisma.machine.findFirst).toHaveBeenCalledTimes(1);
  });

  it('should not find a machine', async () => {
    const machine = await service.findOne(5, userId);
    expect(machine).toEqual({
      statusCode: HttpStatus.NOT_FOUND,
      data: 'Machine not found',
    });
    expect(prisma.machine.findFirst).toHaveBeenCalledWith({
      where: { id: 5, userId },
      select: { id: true, name: true, type: true }
    });
    expect(prisma.machine.findFirst).toHaveBeenCalledTimes(1);
  });

  it('should find all machines', async () => {
    const machines = await service.findAll(userId);
    expect(machines).toEqual({
      statusCode: HttpStatus.OK,
      data: fakeMachines.map(machine => ({
        id: machine.id,
        name: machine.name,
        type: machine.type
      })),
    });
    expect(prisma.machine.findMany).toHaveBeenCalledWith({
      where: { userId },
      select: { id: true, name: true, type: true }
    });
    expect(prisma.machine.findMany).toHaveBeenCalledTimes(1);
  });

  it('should update a machine', async () => {
    const machine = await service.update(1, { name: 'Machine 1', type: 'Pump' }, userId);
    expect(machine).toEqual({
      statusCode: HttpStatus.OK,
      data: {
        id: fakeMachines[0].id,
        name: fakeMachines[0].name,
        type: fakeMachines[0].type
      },
    });
    expect(prisma.machine.update).toHaveBeenCalledWith({
      where: { id: 1, userId },
      data: { name: 'Machine 1', type: 'Pump' }
    });
    expect(prisma.machine.update).toHaveBeenCalledTimes(1);
  });

  it('should not update a machine with wrong type', async () => {
    const machine = await service.update(1, { name: 'Machine 1', type: 'Wrong' }, userId);
    expect(machine).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      data: "Invalid value for attribute 'type' - Message: Invalid input",
    });
    expect(prisma.machine.update).not.toHaveBeenCalled();
  });

  it('should delete a machine', async () => {
    const machine = await service.remove(1, userId);
    expect(machine).toEqual({
      statusCode: HttpStatus.OK,
      data: 'Machine #1 removed',
    });
    expect(prisma.machine.delete).toHaveBeenCalledWith({
      where: { id: 1, userId }
    });
    expect(prisma.machine.delete).toHaveBeenCalledTimes(1);
  });
});
