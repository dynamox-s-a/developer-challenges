import { SetMetadata } from '@nestjs/common';

import type { UserRole } from '@dynamox/domain';

export const ROLES_KEY = 'requiredRoles';

/**
 * Restringe uma rota a perfis específicos. Só é necessário para exceções: por padrão a
 * autorização segue o método HTTP (leitura para todos os autenticados, mutação para
 * quem pode alterar estado), o que evita esquecer de proteger uma rota nova.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
