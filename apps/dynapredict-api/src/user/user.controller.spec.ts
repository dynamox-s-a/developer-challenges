import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

class MockUserService {
  create = jest.fn();
}

describe('User Controller', () => {
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
    service = module.get<MockUserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'testuser@example.com',
        password: 'securePassword123',
      };

      const result = {
        id: '1',
        ...createUserDto,
      };

      service.create.mockResolvedValue(result);

      expect(await controller.create(createUserDto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle errors when user creation fails', async () => {
      const createUserDto: CreateUserDto = {
        email: 'testuser@example.com',
        password: 'securePassword123',
      };

      service.create.mockRejectedValue(new Error('User creation failed'));

      await expect(controller.create(createUserDto)).rejects.toThrow(
        'User creation failed'
      );
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
