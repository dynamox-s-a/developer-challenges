import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './types';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserPayload | null> {
    const user = { email, userId: '1' };
    if (email === 'admin@dynamox.com' && password === '123456') {
      return user;
    }
    return null;
  }

  async login(user: UserPayload) {
    const payload = {
      email: user.email,
      sub: user.userId,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
