import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
      throw new InternalServerErrorException(
        'Failure while hashing users password'
      );
    });

    const { password: _, ...createdUser } = await this.prisma.user.create({
      data: {
        ...user,
        password: hashedPwd,
      },
    });

    return createdUser;
  }

  async findOne(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
