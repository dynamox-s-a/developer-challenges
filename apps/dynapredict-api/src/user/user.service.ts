import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        ...createUserDto,
      },
    });
  }

  async findOne(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
