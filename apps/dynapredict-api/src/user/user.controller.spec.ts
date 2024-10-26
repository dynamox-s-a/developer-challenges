import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

class MockUserService {
  private users: Omit<User, 'password'>[] = [];
  private counter = 1;

  checkExists(email: string) {
    return this.users.some((user) => user.email === email);
  }

  create({
    password: _,
    email,
  }: CreateUserDto): Promise<Omit<User, 'password'>> {
    if (this.checkExists(email)) throw new Error();
    const user = {
      email,
      id: this.counter++,
      createdAt: new Date(),
    };

    this.users.push(user);

    return Promise.resolve(user);
  }
}

describe('UserController', () => {
  let controller: UserController;
  let service: MockUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useClass: MockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(
      UserService
    ) as unknown as MockUserService;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create User', () => {
    it('should create a user', async () => {
      const createDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await controller.create(createDto);

      expect(user).toHaveProperty('id');
      expect(user.email).toBe(createDto.email);
      expect(user).not.toHaveProperty('password');
    });
    it('should throw if using existing user', async () => {
      const createDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      await controller.create(createDto);

      await expect(controller.create(createDto)).rejects.toThrow();
    });
  });
});
