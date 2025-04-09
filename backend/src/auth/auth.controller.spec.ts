import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should call AuthService.signUp with the correct data', async () => {
      const dto: AuthDto = { email: 'test@email.com', password: 'password123' };
      const result = { token: 'test-token' };
      jest.spyOn(authService, 'signUp').mockResolvedValueOnce(result);

      const response = await controller.signUp(dto);

      expect(authService.signUp).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('signIn', () => {
    it('should call AuthService.signIn with the correct data', async () => {
      const dto: AuthDto = { email: 'test@email.com', password: 'password123' };
      const result = { token: 'test-token' };
      jest.spyOn(authService, 'signIn').mockResolvedValueOnce(result);

      const response = await controller.signIn(dto);

      expect(authService.signIn).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });
});
