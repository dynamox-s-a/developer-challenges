import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { LoginRequest, SessionUser } from '@condition-monitor/shared';
import { AUTH_CONFIG, type AuthConfig } from '../config/auth-config';
import { UNKNOWN_USER_HASH, verifyPassword } from './password';
import type { SessionClaims } from './session';
import { UsersRepository } from './users.repository';

const INVALID_CREDENTIALS = 'Invalid email or password.';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersRepository,
    private readonly jwt: JwtService,
    @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
  ) {}

  /** Checks the credentials and returns a signed session token for the user. */
  async login({ email, password }: LoginRequest): Promise<{ user: SessionUser; token: string }> {
    const user = await this.users.findByEmail(email);
    const matches = await verifyPassword(password, user?.passwordHash ?? UNKNOWN_USER_HASH);
    if (!user || !matches) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }
    const claims: SessionClaims = { sub: user.id, email: user.email };
    const token = await this.jwt.signAsync(claims, { expiresIn: this.config.sessionTtlSeconds });
    return { user: { id: user.id, email: user.email }, token };
  }

  /**
   * The user behind a valid session. A token outlives nothing it refers to: if the user
   * was removed, the session is no longer accepted.
   */
  async me(userId: string): Promise<SessionUser> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Authentication required.');
    }
    return user;
  }
}
