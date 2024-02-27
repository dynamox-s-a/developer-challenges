import { AuthGuard } from '@nestjs/passport';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class OwnGuard extends AuthGuard("jwt") implements CanActivate {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const id = +request.params.id;
    return user.userId === id && request.isAuthenticated();
  }
}
