import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../db/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

class MockPrisma {
  user = {
    create: jest.fn(),
    findUniqueOrThrow: jest.fn(),
  };
}

describe('UserService', () => {
  let service: UserService;
  let prisma: MockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useClass: MockPrisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<MockPrisma>(PrismaService);
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      prisma.user.create.mockResolvedValue({
        id: 1,
        email: dto.email,
        createdAt: new Date(),
      });

      const result = await service.create(dto);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: dto.email,
          password: expect.any(String),
        },
      });
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email', dto.email);
      expect(result).toHaveProperty('createdAt');
    });

    it('should throw ConflictException when email already exists', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const prismaError = { code: 'P2002' };
      prisma.user.create.mockRejectedValue(prismaError);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(prisma.user.create).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const email = 'test@example.com';
      const user = {
        id: 1,
        email,
        password: 'hashedPwd',
        createdAt: new Date(),
      };
      prisma.user.findUniqueOrThrow.mockResolvedValue(user);

      const result = await service.findOne(email);

      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const email = 'nonexistent@example.com';
      prisma.user.findUniqueOrThrow.mockRejectedValue(new Error());

      await expect(service.findOne(email)).rejects.toThrow();
      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });
});
