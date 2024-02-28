import { UsersService } from './users.service';
import { JwtStrategy } from '../guard/jwt.strategy';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/PrismaService';
import { mockedUsers, mockedUsersPrisma } from '../../mocks/index.mock';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        JwtStrategy,
        { provide: PrismaService, useValue: mockedUsersPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should create a user', async () => {
    const response = await service.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: '@AnotherSecurePassword123',
    });

    expect(response).toEqual({
      statusCode: 201,
      data: mockedUsers[1],
    });

    expect(prisma.user.create).toHaveBeenCalledTimes(1);
  });

  it('should not create a user and return a 400 status code for an invalid e-mail', async () => {
    const response = await service.create({
      name: 'John Doe',
      email: 'john-email.com',
      password: '@AnotherSecurePassword123',
    });

    expect(response).toEqual({
      statusCode: 400,
      data: [
        {
          code: 'invalid_string',
          message: 'The email is not valid',
          path: [
            'email',
          ],
          validation: 'email',
        },
      ],
    });

    expect(prisma.user.create).toHaveBeenCalledTimes(0);
  });

  it('should not create a user and return a 400 status code for an invalid password', async () => {
    const response = await service.create({
      ...mockedUsers[1],
      password: 'short',
    });

    expect(response).toEqual({
      statusCode: 400,
      data: [
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
      ],
    });
  });

  it('should update a user', async () => {
    const response = await service.update(1, {
      name: 'Leo',
    });

    expect(response).toEqual({
      statusCode: 200,
      data: {
        id: 1,
        name: 'Leonardo Jacomussi',
        email: mockedUsers[0].email,
      },
    });

    expect(prisma.user.update).toHaveBeenCalledTimes(1);
  });


  it('should not update a user and return a 400 status code for an invalid e-mail', async () => {
    const response = await service.update(1, {
      email: 'john-email.com',
    });

    expect(response).toEqual({
      statusCode: 400,
      data: [
        {
          code: 'invalid_string',
          message: 'The email is not valid',
          path: [
            'email',
          ],
          validation: 'email',
        },
      ],
    });

    expect(prisma.user.update).toHaveBeenCalledTimes(0);
  });

  it('should not update a user and return a 404 status code for an invalid user id', async () => {
    const response = await service.update(800, {
      name: 'John Doe',
    });

    expect(response).toEqual({
      statusCode: 404,
      data: 'User not found',
    });

    expect(prisma.user.update).toHaveBeenCalledTimes(0);
  });
});
