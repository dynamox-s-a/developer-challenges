import EventEmitter from 'events';
import { Request } from 'express';
import httpMock from 'node-mocks-http';
import { HttpStatus } from '@nestjs/common';
import { JwtStrategy } from '../guard/jwt.strategy';
import { MachinesService } from './machines.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/PrismaService';
import { MachinesController } from './machines.controller';
import { CreateMachineDto, UpdateMachineDto } from '@dynamox-challenge/dto';
import { mockedMachines, mockedMachinesPrisma } from '../../mocks/index.mock';

interface AuthRequest extends Request {
  user: {
    userId: number;
  }
}

describe('MachinesController', () => {
  const userId = 1;
  let controller: MachinesController;
  let service: MachinesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachinesController],
      providers: [
        JwtStrategy,
        MachinesService,
        { provide: PrismaService, useValue: mockedMachinesPrisma },
      ],
    }).compile();

    controller = module.get<MachinesController>(MachinesController);
    service = module.get<MachinesService>(MachinesService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should create a machine', async () => {
    const body: CreateMachineDto = {
      name: 'Machine 1',
      type: 'Pump',
    };

    const req = httpMock.createRequest({
      user: { userId },
    }) as AuthRequest;
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });

    await controller.create(body, res, req);

    expect(prisma.machine.create).toHaveBeenCalledWith({
      data: {
        ...body,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    const response = res._getJSONData();
    const statusCode = res._getStatusCode();

    expect(statusCode).toBe(HttpStatus.CREATED);
    expect(response).toEqual({
      id: mockedMachines[1].id,
      name: mockedMachines[1].name,
      type: mockedMachines[1].type,
    });
  });

  it('should not create a machine with wrong type', async () => {
    const body: CreateMachineDto = {
      name: 'Machine 1',
      type: 'Wrong',
    };

    const req = httpMock.createRequest({
      user: { userId },
    }) as AuthRequest;
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });

    await controller.create(body, res, req);

    const response = res._getJSONData();
    const statusCode = res._getStatusCode();

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(response).toEqual("Invalid value for attribute 'type' - Message: Invalid input");
    expect(prisma.machine.create).not.toHaveBeenCalled();
  });

  it('should find all machines', async () => {
    const req = httpMock.createRequest({
      user: { userId },
    }) as AuthRequest;
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });

    await controller.findAll(res, req);

    expect(prisma.machine.findMany).toHaveBeenCalledWith({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });

    const response = res._getJSONData();
    const statusCode = res._getStatusCode();

    expect(statusCode).toBe(HttpStatus.OK);
    expect(response).toEqual(mockedMachines.map(machine => ({
      id: machine.id,
      name: machine.name,
      type: machine.type,
    })));
    expect(prisma.machine.findMany).toHaveBeenCalledTimes(1);
  });

  it('should find a machine', async () => {
    const req = httpMock.createRequest({
      user: { userId },
    }) as AuthRequest;
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });

    await controller.findOne('1', res, req);

    expect(prisma.machine.findFirst).toHaveBeenCalledWith({
      where: { id: 1, userId },
      select: { id: true, name: true, type: true },
    });

    const response = res._getJSONData();
    const statusCode = res._getStatusCode();

    expect(statusCode).toBe(HttpStatus.OK);
    expect(response).toEqual({
      id: mockedMachines[0].id,
      name: mockedMachines[0].name,
      type: mockedMachines[0].type,
    });
    expect(prisma.machine.findFirst).toHaveBeenCalledTimes(1);
  });

  it('should not find a machine', async () => {
    const req = httpMock.createRequest({
      user: { userId },
    }) as AuthRequest;
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });

    await controller.findOne('5', res, req);

    const response = res._getJSONData();
    const statusCode = res._getStatusCode();

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(response).toEqual('Machine not found');
    expect(prisma.machine.findFirst).toHaveBeenCalledWith({
      where: { id: 5, userId },
      select: { id: true, name: true, type: true },
    });
    expect(prisma.machine.findFirst).toHaveBeenCalledTimes(1);
  });

  it('should update a machine', async () => {
    const body: UpdateMachineDto = {
      name: 'Machine 1',
      type: 'Pump',
    };

    const req = httpMock.createRequest({
      user: { userId },
    }) as AuthRequest;
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });

    await controller.update('1', body, res, req);

    expect(prisma.machine.update).toHaveBeenCalledWith({
      where: { id: 1, userId },
      data: body,
    });

    const response = res._getJSONData();
    const statusCode = res._getStatusCode();

    expect(statusCode).toBe(HttpStatus.OK);
    expect(response).toEqual({
      id: mockedMachines[0].id,
      name: mockedMachines[0].name,
      type: mockedMachines[0].type,
    });
    expect(prisma.machine.update).toHaveBeenCalledTimes(1);
  });

  it('should not update a machine with wrong type', async () => {
    const body: UpdateMachineDto = {
      name: 'Machine 1',
      type: 'Wrong',
    };

    const req = httpMock.createRequest({
      user: { userId },
    }) as AuthRequest;
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });

    await controller.update('1', body, res, req);

    const response = res._getJSONData();
    const statusCode = res._getStatusCode();

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(response).toEqual("Invalid value for attribute 'type' - Message: Invalid input");
    expect(prisma.machine.update).not.toHaveBeenCalled();
  });

  it('should remove a machine', async () => {
    const req = httpMock.createRequest({
      user: { userId },
    }) as AuthRequest;
    const res = httpMock.createResponse({ eventEmitter: EventEmitter });

    await controller.remove('1', res, req);

    expect(prisma.machine.delete).toHaveBeenCalledWith({
      where: { id: 1, userId },
    });

    const response = res._getJSONData();
    const statusCode = res._getStatusCode();

    expect(statusCode).toBe(HttpStatus.OK);
    expect(response).toEqual('Machine #1 removed');
    expect(prisma.machine.delete).toHaveBeenCalledTimes(1);
  });
});
