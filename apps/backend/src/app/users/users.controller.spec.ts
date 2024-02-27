import EventEmitter from 'events';
import httpMock from 'node-mocks-http';
import { HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtStrategy } from '../guard/jwt.strategy';
import { UsersController } from './users.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/PrismaService';
import { CreateUserDto, UpdateUserDto } from '@dynamox-challenge/dto';

const fakeUsers = [
  {
    id: 1,
    name: 'Leonardo Jacomussi',
    email: 'leonardo@email.com',
    password: '#UmaSenhaSegura123',
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@email.com',
    password: '@AnotherSecurePassword123',
  }
];

const prismaMock = {
  user: {
    create: jest.fn().mockReturnValue(fakeUsers[1]),
    findUnique: jest.fn().mockImplementation((args) => {
      if (args.where.email) {
        return null;
      }
      if (args.where.id) {
        return fakeUsers.filter((user) => user.id === args.where.id)[0];
      }
    }),
    findMany: jest.fn().mockResolvedValue(fakeUsers),
    update: jest.fn().mockResolvedValue(fakeUsers[0]),
    delete: jest.fn(),
  },
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        JwtStrategy,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should create a user', async () => {
    const body: CreateUserDto = {
      name: 'John Doe',
      email: 'john@email.com',
      password: '@AnotherSecurePassword123',
    };

    const res = httpMock.createResponse({ eventEmitter: EventEmitter });

    await controller.create(body, res);

    const response = res._getJSONData();
    const statusCode = res._getStatusCode();

    expect(response).toEqual(fakeUsers[1]);
    expect(statusCode).toBe(HttpStatus.CREATED);

    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('should not create a user and return a 400 status code for an invalid e-mail', async () => {
    const body: CreateUserDto = {
      name: 'John Doe',
      email: 'invalid-email',
      password: '@AnotherSecurePassword123',
    };

    const res = httpMock.createResponse({ eventEmitter: EventEmitter });

    await controller.create(body, res);

    const response = res._getJSONData();
    const statusCode = res._getStatusCode();

    expect(response).toEqual([
      {
        code: 'invalid_string',
        message: 'The email is not valid',
        path: [
          'email',
        ],
        validation: 'email',
      },
    ]);
    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should not create a user and return a 400 status code for an invalid password', async () => {
    const body: CreateUserDto = {
      ...fakeUsers[1],
      password: 'short',
    };

    const res = httpMock.createResponse({ eventEmitter: EventEmitter });

    await controller.create(body, res);

    const response = res._getJSONData();
    const statusCode = res._getStatusCode();

    expect(response).toEqual([
      {
        code: 'too_small',
        exact: false,
        inclusive: true,
        message: 'The password has to be at least 8 characters long',
        minimum: 8,
        path:  ['password'],
        type: 'string',
      },
      {
        code: 'invalid_string',
        message: 'The password must contain at least 1 lowercase letter, 1 uppercase letter and 1 number',
          path: ['password'],
        validation: 'regex',
      }
    ]);
    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should update a user', async () => {
    const body: UpdateUserDto = {
      name: 'Leonardo Jacomussi',
    };

    const res = httpMock.createResponse({ eventEmitter: EventEmitter });

    await controller.update(String(1), body, res);

    const response = res._getJSONData();
    const statusCode = res._getStatusCode();

    expect(response).toEqual({
      id: 1,
      name: 'Leonardo Jacomussi',
      email: fakeUsers[0].email,
    });
    expect(statusCode).toBe(HttpStatus.OK);
    expect(prisma.user.update).toHaveBeenCalled();
  });

  it('should not update a user and return a 400 status code for an invalid e-mail', async () => {
    const body: UpdateUserDto = {
      email: 'invalid-email',
    };

    const res = httpMock.createResponse({ eventEmitter: EventEmitter });

    await controller.update(String(1), body, res);

    const response = res._getJSONData();
    const statusCode = res._getStatusCode();

    expect(response).toEqual([
      {
        code: 'invalid_string',
        message: 'The email is not valid',
        path: [
          'email',
        ],
        validation: 'email',
      },
    ]);
    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(prisma.user.update).toHaveBeenCalledTimes(0);
  });

  it('should not update a user and return a 404 status code for an invalid user id', async () => {
    const body: UpdateUserDto = {
      name: 'John Doe',
    };

    const res = httpMock.createResponse({ eventEmitter: EventEmitter });

    await controller.update(String(800), body, res);

    const response = res._getJSONData();
    const statusCode = res._getStatusCode();

    expect(response).toEqual('User not found');
    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(prisma.user.update).toHaveBeenCalledTimes(0);
  });
});
