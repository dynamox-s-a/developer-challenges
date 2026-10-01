import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC } from './public.decorator';
import { SESSION_COOKIE, type AuthenticatedRequest, type SessionClaims } from './session';

/**
 * Global guard: every route requires a valid session cookie unless marked `@Public()`.
 * A missing, forged or expired token all answer the same 401, so the response never
 * tells an attacker which check failed.
 */
@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token: unknown = request.cookies?.[SESSION_COOKIE];
    if (typeof token !== 'string' || token === '') {
      throw new UnauthorizedException('Authentication required.');
    }
    try {
      const claims = await this.jwt.verifyAsync<SessionClaims>(token);
      request.user = { id: claims.sub, email: claims.email };
      return true;
    } catch {
      throw new UnauthorizedException('Authentication required.');
    }
  }
}
