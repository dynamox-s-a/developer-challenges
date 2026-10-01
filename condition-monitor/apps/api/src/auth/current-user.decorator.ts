import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { SessionUser } from '@condition-monitor/shared';
import type { AuthenticatedRequest } from './session';

/** The user the session guard attached to the request. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): SessionUser =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().user,
);
