import { ConflictException, Injectable } from '@nestjs/common';
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
      const { id, email, createdAt } = await this.prisma.user.create({
        data: {
          ...user,
          password: hashedPwd,
        },
      });
      return { id, email, createdAt };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('User with this email already exists');
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
