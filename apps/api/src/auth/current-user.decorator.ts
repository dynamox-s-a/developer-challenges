import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import type { JwtPayload } from './jwt-auth.guard';

/** O usuário autenticado que o guard JWT colocou em `request.user`. */
export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): JwtPayload => {
  const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
  return request.user;
});
