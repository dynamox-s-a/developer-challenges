import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Determines whether the current request is allowed to proceed based on the presence of a user session.
   * @param {ExecutionContext} context - The execution context that provides details about the current request.
   * @returns {boolean | Promise<boolean> | Observable<boolean>} - Returns true if the user session exists, otherwise false.
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    return !!request.session?.user;
  }
}
