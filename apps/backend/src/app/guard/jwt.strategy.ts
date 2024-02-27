import {
  Injectable,
  BadRequestException,
} from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      secretOrPrivateKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: {
    sub?: number,
    username?: string,
    token_use?: string,
    iat: number,
    exp: number
  }) {
    if (!payload.token_use || payload.token_use !== "access" || !payload.sub || !payload.username) {
      throw new BadRequestException("Invalid token");
    }
    return { userId: payload.sub, username: payload.username};
  }
}
