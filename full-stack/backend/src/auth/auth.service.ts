import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async session(authUserDto: SignInDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: authUserDto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    const passwordMatch = await compare(authUserDto.password, user?.password);

    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}