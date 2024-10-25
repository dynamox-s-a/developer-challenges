import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ValidatedUser } from './auth.service';
export { ValidatedUser as AuthUser };

export const User = createParamDecorator(
  <T extends ValidatedUser = ValidatedUser>(
    data: unknown,
    ctx: ExecutionContext
  ): T => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as T;
  }
);
