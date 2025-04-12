import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user and return a token', async () => {
      const dto = { email: 'test@email.com', password: 'password123' };
      const hashedPassword = 'hashedPassword';
      jest.spyOn(argon, 'hash').mockResolvedValueOnce(hashedPassword);
      jest.spyOn(prisma.user, 'create').mockResolvedValueOnce({
        id: 1,
        email: dto.email,
        password: hashedPassword,
      });
      jest.spyOn(jwt, 'signAsync').mockResolvedValueOnce('test-token');

      const result = await service.signUp(dto);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
      });
      expect(result).toEqual({ token: 'test-token' });
    });

    it('should throw an error if email is already taken', async () => {
      const dto = { email: 'test@email.com', password: 'password123' };
      jest
        .spyOn(prisma.user, 'create')
        .mockRejectedValueOnce({ code: 'P2002' });

      await expect(service.signUp(dto)).rejects.toThrowError(
        'Credentials taken',
      );
    });
  });

  describe('signIn', () => {
    it('should return a token if credentials are valid', async () => {
      const dto = { email: 'test@email.com', password: 'password123' };
      const user = { id: 1, email: dto.email, password: 'hashedPassword' };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(user);
      jest.spyOn(argon, 'verify').mockResolvedValueOnce(true);
      jest.spyOn(jwt, 'signAsync').mockResolvedValueOnce('test-token');

      const result = await service.signIn(dto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(result).toEqual({ token: 'test-token' });
    });

    it('should throw ForbiddenException if user is not found', async () => {
      const dto = { email: 'test@email.com', password: 'password123' };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.signIn(dto)).rejects.toThrowError(
        new ForbiddenException('User not found'),
      );
    });

    it('should throw ForbiddenException if password is invalid', async () => {
      const dto = { email: 'test@email.com', password: 'password123' };
      const user = { id: 1, email: dto.email, password: 'hashedPassword' };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(user);
      jest.spyOn(argon, 'verify').mockResolvedValueOnce(false);

      await expect(service.signIn(dto)).rejects.toThrowError(
        new ForbiddenException('Invalid password'),
      );
    });
  });

  describe('signToken', () => {
    it('should return a signed token', async () => {
      const userId = 1;
      const email = 'test@email.com';
      jest.spyOn(jwt, 'signAsync').mockResolvedValueOnce('test-token');

      const result = await service.signToken(userId, email);

      expect(jwt.signAsync).toHaveBeenCalledWith(
        { sub: userId, email },
        { expiresIn: '1h', secret: 'test-secret' },
      );
      expect(result).toEqual({ token: 'test-token' });
    });
  });
});
