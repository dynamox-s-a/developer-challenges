import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import { isUserRole, type UserRole } from '@dynamox/domain';

import { IS_PUBLIC_KEY } from './public.decorator';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

/**
 * O token é assinado por esta API, mas o payload ainda chega como dado externo: um token
 * emitido antes da introdução dos perfis não traz `role`. Validar em runtime evita que a
 * autorização dependa de um cast — sem perfil reconhecível, a sessão não vale.
 */
function parseJwtPayload(payload: unknown): JwtPayload {
  if (payload === null || typeof payload !== 'object') {
    throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Sessão inválida ou expirada.' });
  }
  const { sub, email, role } = payload as Record<string, unknown>;
  if (typeof sub !== 'string' || typeof email !== 'string' || !isUserRole(role)) {
    throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Sessão inválida ou expirada.' });
  }
  return { sub, email, role };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request & { user?: JwtPayload }>();
    const header = request.headers.authorization ?? '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Autenticação necessária.' });
    }

    try {
      const payload: unknown = await this.jwtService.verifyAsync(token);
      request.user = parseJwtPayload(payload);
      return true;
    } catch {
      // Mensagem genérica de propósito: não distinguir token inválido, adulterado ou expirado.
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Sessão inválida ou expirada.' });
    }
  }
}
