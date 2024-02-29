import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import User from '../models/user.model';
import UserService from './user.service';

@Injectable()
export default class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne({
      where: { email },
      withDeleted: true,
    });
    if (!user) {
      throw new UnauthorizedException(
        'Usuário não encontrado',
        'user_not_found'
      );
    }
    if (user.deleted) {
      throw new UnauthorizedException('Usuário desabilitado', 'user_disabled');
    }

    if (user.password === this.userService.encryptPassword(password)) {
      return user;
    } else {
      throw new UnauthorizedException(
        'Usuário e/ou senha inválidos',
        'invalid_credentials'
      );
    }
  }

  async generateAccessToken(user: User) {
    const payload = {
      name: user.name,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        issuer: 'dynamox',
        algorithm: 'HS256',
        subject: user._id.toString(),
        expiresIn: '1d',
        secret: process.env.TOKEN_SECRET,
      }),
    };
  }
}
