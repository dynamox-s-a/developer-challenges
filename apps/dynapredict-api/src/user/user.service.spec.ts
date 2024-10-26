import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../db/prisma.service';
import { UserService } from './user.service';

type Data = {
  email: string;
  password: string;
};

type PrismaCreateParameter = {
  data: Data;
};

type PrismaFindParameter = {
  where: {
    email: string;
  };
};

type User = {
  createdAt: number;
  id: number;
} & Data;

class MockPrismaService {
  private users: User[] = [];
  private idCounter = 1;

  user = {
    create: async (opts: PrismaCreateParameter) => {
      const { data } = opts;
      const newUser: User = {
        ...data,
        createdAt: Date.now(),
        id: this.idCounter++,
      };

      this.users.push(newUser);

      return newUser;
    },

    findUnique: async (opts: PrismaFindParameter): Promise<User | null> => {
      const {
        where: { email },
      } = opts;
      const user = this.users.find((u) => u.email === email);

      if (!user) {
        return null;
      }

      return user;
    },
  };
}

describe('UserService', () => {
  let service: UserService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = { email: 'test@example.com', password: 'password123' };
      const createdUser = await service.create(userData);

      expect(createdUser).toBeDefined();
      expect(createdUser.email).toBe(userData.email);
      expect(createdUser.id).toBeDefined();
    });

    it('should return null if user with email already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
      };
      await service.create(userData);

      expect(await service.create(userData)).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should find a user by email', async () => {
      const userData = { email: 'find@example.com', password: 'password123' };
      await service.create(userData);

      const foundUser = await service.findOne(userData.email);

      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe(userData.email);
    });

    it('should return null if user is not found', async () => {
      const nonExistentEmail = 'nonexistent@example.com';
      const foundUser = await service.findOne(nonExistentEmail);

      expect(foundUser).toBeNull();
    });
  });
});
