import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';

export type ValidatedUser = Omit<User, 'password' | 'createdAt'>;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    email: string,
    pwd: string
  ): Promise<ValidatedUser | null> {
    const user = await this.userService.findOne(email);
    const match = await bcrypt.compare(pwd, user.password);
    if (user && match) {
      const { id, email } = user;
      return { id, email };
    }
    return null;
  }

  async login(user: ValidatedUser) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
