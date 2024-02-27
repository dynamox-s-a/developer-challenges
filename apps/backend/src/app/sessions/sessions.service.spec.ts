import { JwtService } from '@nestjs/jwt';
import { SessionsService } from './sessions.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateSessionDto } from '@dynamox-challenge/dto';
import { PrismaService } from '../database/PrismaService';

describe('SessionsService', () => {
  let service: SessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionsService, JwtService, PrismaService],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a session', async () => {
    const body: CreateSessionDto = {
      email: 'leonardo@email.com',
	    password: 'hard@*rock!',
    };

    const response = await service.create(body);

    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('data');

    expect(response.statusCode).toBe(201);

    expect(response.data).toHaveProperty('accessToken');
    expect(response.data).toHaveProperty('user');

    if (typeof response.data === 'object') {
      expect(response.data.user).toBeInstanceOf(Object);
      expect(response.data.user).toHaveProperty('id');
      expect(response.data.user).toHaveProperty('name');
      expect(response.data.user).toHaveProperty('email');
    }
  });

  it('should not create a session and return a 400 status code', async () => {
    const body: CreateSessionDto = {
      email: 'invalid-email',
      password: 'invalid-password',
    };

    try {
      await service.create(body);
    } catch (error) {
      if (typeof error === 'object') {
        expect(error).toBeInstanceOf(Object);
        expect(error).toHaveProperty('response');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorWithResponse = error as { response: any, status: number, options: any };

        expect(errorWithResponse.status).toBe(400);

        expect(errorWithResponse.response).toBeInstanceOf(Object);
        expect(errorWithResponse.response[0].validation).toBe('email');
        expect(errorWithResponse.response[0].message).toBe('Invalid email');
      }
    }
  });

  it('should not create a session with invalid credentials', async () => {
    const body: CreateSessionDto = {
      email: 'leonardo@email.com',
      password: 'invalid-password',
    };

    try {
      await service.create(body);
    } catch (error) {
      console.log(error);
      if (typeof error === 'object') {
        expect(error).toBeInstanceOf(Object);
        expect(error).toHaveProperty('response');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorWithResponse = error as { response: any };

        expect(errorWithResponse.response).toBeInstanceOf(Object);
        expect(errorWithResponse.response).toHaveProperty('statusCode');
        expect(errorWithResponse.response.statusCode).toBe(401);
        expect(errorWithResponse.response).toHaveProperty('message');
        expect(errorWithResponse.response.message).toBe('Invalid credentials');
      }
    }
  });
});
