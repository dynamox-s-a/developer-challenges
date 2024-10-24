import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../db/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

class MockPrismaService {
  private users = [];
  private idCounter = 1;

  user = {
    create: jest.fn().mockImplementation((data) => {
      const newUser = {
        id: this.idCounter++,
        createdAt: Date.now(),
        ...data.data,
      };
      this.users.push(newUser);
      return Promise.resolve(newUser);
    }),
    findUnique: jest.fn().mockImplementation(({ where }) => {
      const user = this.users.find((u) => u.email === where.email);
      return Promise.resolve(user);
    }),
  };
}

describe('UserService', () => {
  let service: UserService;
  let prisma: MockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<MockPrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResult = { id: 1, ...createUserDto };

      const { createdAt, ...result } = await service.create(createUserDto);
      expect(result).toEqual(expectedResult);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by email', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const createdUser = await service.create(createUserDto);

      const result = await service.findOne(createdUser.email);
      expect(result).toEqual(createdUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: createdUser.email },
      });
    });
  });
});
