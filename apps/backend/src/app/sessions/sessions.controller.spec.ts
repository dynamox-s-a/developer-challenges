import EventEmitter from 'events';
import httpMock from 'node-mocks-http';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateSessionDto } from '@dynamox-challenge/dto';
import { PrismaService } from '../database/PrismaService';
import { SessionsController } from './sessions.controller';

describe('SessionsController', () => {
  let controller: SessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [SessionsService, JwtService, PrismaService],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a token', async () => {
    const body: CreateSessionDto = {
      email: 'leonardo@email.com',
	    password: 'hard@*rock!',
    };

    const res = httpMock.createResponse({ eventEmitter: EventEmitter });

    await controller.create(body, res);

    const response = res._getJSONData();
    const statusCode = res._getStatusCode();

    expect(response).toHaveProperty('accessToken');
    expect(response).toHaveProperty('user');
    expect(statusCode).toBe(HttpStatus.CREATED);
  });

  it('should not create a session and return a 400 status code', async () => {
    const body: CreateSessionDto = {
      email: 'invalid-email',
      password: 'invalid-password',
    };

    const res = httpMock.createResponse({ eventEmitter: EventEmitter });

    await controller.create(body, res);

    const statusCode = res._getStatusCode();
    const response = res._getJSONData();

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(response).toBe('Invalid credentials');
  });

  it('should return a 401 status code', async () => {
    const body: CreateSessionDto = {
      email: 'leonardo@email.com',
      password: 'invalid-password',
    };

    const res = httpMock.createResponse({ eventEmitter: EventEmitter });

    await controller.create(body, res);

    const statusCode = res._getStatusCode();
    const response = res._getJSONData();

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
    expect(response).toBe('Invalid credentials');
  });

});
