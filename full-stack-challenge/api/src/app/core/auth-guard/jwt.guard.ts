import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtGuard extends AuthGuard(['bearerAdmin']) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      'public-endpoint',
      [context.getHandler(), context.getClass()]
    );
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
