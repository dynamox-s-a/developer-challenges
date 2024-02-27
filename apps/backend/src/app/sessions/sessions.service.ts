import {
  HttpStatus,
  Injectable,
  HttpException,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaError } from '@dynamox-challenge/prisma';
import { PrismaService } from '../database/PrismaService';
import { CreateSessionDto, createSessionDto } from '@dynamox-challenge/dto';

@Injectable()
export class SessionsService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async create(body: CreateSessionDto): Promise<{
    statusCode: number;
    data: string | { user: User; accessToken: string };
  }> {
    const validation = createSessionDto.safeParse(body);

    if (!validation.success) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        data: 'Invalid credentials',
      };
    }

    const data = validation.data;

    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });

      if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const validPassword = await compare(
        data.password,
        user.password
      );

      if (!validPassword) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          data: 'Invalid credentials',
        };
      }

      const accessToken = this.jwtService.sign(
        {
          sub: user.id,
          username: user.name,
          token_use: 'access',
        },
        {
          expiresIn: '1d',
          secret: process.env.JWT_SECRET,
        }
      );

      return {
        statusCode: HttpStatus.CREATED,
        data: {
          user,
          accessToken,
        },
      };
    } catch (error) {
      return PrismaError.handle(error);
    }
  }
}
