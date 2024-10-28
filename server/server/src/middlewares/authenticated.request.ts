import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthenticatedRequest implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const { authorization } = request.headers;

    if (!authorization) {
      throw new UnauthorizedException('Token not provided!');
    }

    const token = authorization.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
      request.body.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid Token!');
    }
  }
}
