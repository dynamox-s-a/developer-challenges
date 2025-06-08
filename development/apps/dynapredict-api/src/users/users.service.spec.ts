import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';

class MockPrisma {
  user = {
    create: jest.fn(),
    findUniqueOrThrow: jest.fn(),
  };
}

describe('UserService', () => {
  let service: UsersService;
  let prisma: MockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useClass: MockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<MockPrisma>(PrismaService);
  });

  describe('create', () => {
    //eslint-disable-next-line
    let mockRepository: any;

    beforeEach(async () => {
    mockRepository = {
      findFirst: jest.fn(),
      create: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService, PrismaService,
        {
          provide: UsersService,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
  });

    it('should create a user', async () => {
      const dto: CreateUserDTO = {
        name: 'foo',
        email: 'foo@bar.com',
        password: '123foobar',
      };

      const createdAtTimeStamp = new Date()

      prisma.user.create.mockResolvedValue({
        id: 1,
        email: dto.email,
        password: dto.password,
        createdAt: createdAtTimeStamp,
      });

      const result = prisma.user.create({data: {
        id: 1,
        email: dto.email,
        password: dto.password,
        createdAt: createdAtTimeStamp,
      }});

      expect(prisma.user.create).toHaveBeenCalledWith({ data:
          {id: 1,
          email: dto.email,
          password:  dto.password,
          createdAt: createdAtTimeStamp,}
        },
      );

      expect(result).resolves.toHaveProperty('id');
      expect(result).resolves.toHaveProperty('email', dto.email);
      expect(result).resolves.toHaveProperty('createdAt');
    });

    it('should throw BadRequestException when email is taken', async () => {

      const prismaError = new BadRequestException;
      const result = prisma.user.create.mockRejectedValue(prismaError);

      await expect(result).rejects.toThrow(BadRequestException);

      expect(prisma.user.create).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const email = 'foo@bar.com';
      const id = 1;
      const user = {
        id,
        email,
        password: 'hashedPwd',
        createdAt: new Date(),
      };
      prisma.user.findUniqueOrThrow.mockResolvedValue(user);

      const result = await service.findOne(id);

      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = 0;
      prisma.user.findUniqueOrThrow.mockRejectedValue(new Error());
      

      await expect(service.findOne(id)).rejects.toThrow();
      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
