import {
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { ZodIssue } from 'zod';
import { PrismaError } from '@dynamox-challenge/prisma';
import { PrismaService } from '../database/PrismaService';
import { CreateUserDto, createUserDto } from '@dynamox-challenge/dto';
import { UpdateUserDto, updateUserDto } from '@dynamox-challenge/dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(body: CreateUserDto): Promise<{
    statusCode: number;
    data: ZodIssue[] | string | { name: string; email: string; id: number };
  }> {
    const validation = createUserDto.safeParse(body);

    if (!validation.success) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        data: validation.error.errors
      }
    }

    const data: CreateUserDto = validation.data;

    try {
      const checkUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (checkUser) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          data: 'User already exists',
        }
      }

      const hashedPassword = await hash(data.password, 10);

      const user = await this.prisma.user.create({ data: { ...data, password: hashedPassword } });

      return {
        statusCode: HttpStatus.CREATED,
        data: user,
      };
    } catch (error) {
      return PrismaError.handle(error);
    }
  }

  async update(id: number, body: UpdateUserDto): Promise<{
    statusCode: number,
    data: ZodIssue[] | string | { name: string; email: string; id: number }
  }> {
    const validation = updateUserDto.safeParse(body);

    if (!validation.success) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        data: validation.error.errors
      }
    }

    const data: UpdateUserDto = validation.data;

    const checkUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!checkUser) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        data: 'User not found',
      }
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
      });

      return {
        statusCode: HttpStatus.OK,
        data: {
          name: user.name,
          email: user.email,
          id: user.id
        }
      };
    } catch (error) {
      return PrismaError.handle(error);
    }
  }
}
