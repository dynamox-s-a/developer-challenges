import { scryptSync, timingSafeEqual } from 'node:crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { UserRole } from '@dynamox/domain';

import { PrismaService } from '../prisma/prisma.service';

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

/** Verifica o formato `scrypt$salt$hash` produzido pelo seed, em tempo constante. */
export function verifyPassword(password: string, stored: string): boolean {
  const [algorithm, salt, expected] = stored.split('$');
  if (algorithm !== 'scrypt' || !salt || !expected) return false;
  const derived = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expected, 'hex');
  return derived.length === expectedBuffer.length && timingSafeEqual(derived, expectedBuffer);
}

/**
 * Hash de referência para e-mail inexistente: o custo do scrypt é pago nos dois caminhos,
 * evitando que a diferença de latência revele se o e-mail está cadastrado.
 */
const DUMMY_HASH = `scrypt$${'0'.repeat(32)}$${scryptSync('senha-de-referencia', '0'.repeat(32), 64).toString('hex')}`;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<{ token: string; user: PublicUser }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // 401 genérico e custo constante: não revelar por corpo NEM por tempo se o e-mail existe.
    const valid = verifyPassword(password, user?.passwordHash ?? DUMMY_HASH) && user !== null;
    if (!user || !valid) {
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Credenciais inválidas.' });
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async me(userId: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Sessão inválida ou expirada.' });
    }
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
