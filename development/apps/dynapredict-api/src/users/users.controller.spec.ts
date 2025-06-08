import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

class MockUsersService {
  create = jest.fn();
}

describe('User Controller', () => {
  let controller: UsersController;
  let service: MockUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useClass: MockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<MockUsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      const createUserDto: CreateUserDTO = {
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
      const createUserDto: CreateUserDTO = {
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
