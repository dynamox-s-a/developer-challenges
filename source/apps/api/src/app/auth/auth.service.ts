import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma } from '@source/persistence';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }

  // Helper to create a default user if none exists (for dev/fixed credentials)
  async ensureDefaultUser() {
    const defaultEmail = 'admin@dynamox.com';
    const defaultPassword = 'admin1234';
    
    const user = await prisma.user.findUnique({ where: { email: defaultEmail } });
    if (!user) {
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      await prisma.user.create({
        data: {
          email: defaultEmail,
          password: hashedPassword,
        },
      });
      console.log('Default user created: admin@dynamox.com / admin');
    }
  }
}
