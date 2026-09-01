import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { canMutate, type UserRole } from '@dynamox/domain';

import type { JwtPayload } from './jwt-auth.guard';
import { IS_PUBLIC_KEY } from './public.decorator';
import { ROLES_KEY } from './roles.decorator';

/** Métodos que não alteram estado persistido. */
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Autorização por perfil. Roda depois da autenticação: aqui o usuário já provou quem é,
 * então a recusa é 403 (autenticado, sem permissão) e nunca 401.
 *
 * A regra padrão vem do método HTTP em vez de uma lista de rotas: qualquer endpoint de
 * mutação criado no futuro já nasce restrito, sem depender de alguém lembrar de anotá-lo.
 * `@Roles(...)` existe para as exceções.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request & { user?: JwtPayload }>();
    const user = request.user;
    // Sem usuário aqui significa que o guard de autenticação não rodou; recusar é mais
    // seguro do que assumir permissão.
    if (!user) throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Permissão insuficiente.' });

    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const allowed = required?.length
      ? required.includes(user.role)
      : SAFE_METHODS.has(request.method) || canMutate(user.role);

    if (!allowed) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Seu perfil permite apenas consulta. Esta operação exige um perfil administrador.',
      });
    }
    return true;
  }
}
