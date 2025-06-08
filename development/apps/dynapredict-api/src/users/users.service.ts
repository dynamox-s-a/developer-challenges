import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { SignupResponse } from './user';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(payload: CreateUserDTO): Promise<SignupResponse> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: payload.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('User email already in use', {
        cause: new Error(),
        description: 'email is already registered to an existing user account',
      });
    }

    const hash = await this.encryptPassword(payload.password, 10);
    payload.password = hash;
    return await this.prisma.user.create({
      data: payload,
      select: {
        email: true,
        id: true,
      },
    });
  }

  async encryptPassword(plainText, saltRounds) {
    return await bcrypt.hash(plainText, saltRounds);
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async update(id: number) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number): Promise<string> {
    try {
      await this.prisma.user.delete({
        where: {
          id,
        },
      });
      return 'User account deleted successfully';
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }
}
