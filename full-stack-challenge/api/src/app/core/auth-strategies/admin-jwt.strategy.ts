import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export default class AdminJwtStrategy extends PassportStrategy(
  Strategy,
  'bearerAdmin'
) {
  constructor(private reflector: Reflector) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        AdminJwtStrategy.fromCookies,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.TOKEN_SECRET,
    });
  }

  private static fromCookies(request): string | null {
    if (request.cookies && request.cookies['adminAccessToken']) {
      return request.cookies['adminAccessToken'];
    }
    return null;
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      type: payload.type,
      permissions: payload.permissions,
    };
  }
}
