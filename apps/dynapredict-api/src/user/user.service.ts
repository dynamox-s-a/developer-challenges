import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../db/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashedPwd = await bcrypt.hash(password, 10).catch((err) => {
      console.log(err);
      throw new Error(err);
    });

    try {
      const { password: _, ...createdUser } = await this.prisma.user.create({
        data: {
          ...user,
          password: hashedPwd,
        },
      });
      return createdUser;
    } catch (error) {
      if (error.code === 'P2002') {
        return null;
      }
      throw error;
    }
  }

  async findOne(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
