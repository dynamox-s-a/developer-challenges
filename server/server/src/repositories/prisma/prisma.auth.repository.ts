import { PrismaService } from 'src/database/prisma.service';
import { AuthRepostory } from '../AuthRepository/auth.repository';
import { User } from '@prisma/client';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

@Injectable()
export class PrismaAuthRepository implements AuthRepostory {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const SALT_FACTOR = 8;
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    return bcrypt.hash(password, salt);
  }

  async create(user: Omit<User, 'id'>): Promise<void> {
    let hashedPassword = await this.hashPassword(user.password);
    let existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (existingUser) {
      throw new InternalServerErrorException(
        `User "${user.email}" already exists`,
      );
    }
    await this.prisma.user.create({
      data: { email: user.email, password: hashedPassword },
    });
  }

  async login(user: Omit<User, 'id'>): Promise<{ access_token: string }> {
    const secretKey: string = process.env.SECRET_KEY || 'secret';
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      throw new UnauthorizedException('User not exists, verify!');
    }
    const isPasswordValid = bcrypt.compareSync(
      user.password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password invalid, verify!');
    }

    const payload = { id: existingUser.id, email: existingUser.email };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: secretKey,
    });

    return { access_token };
  }
}
