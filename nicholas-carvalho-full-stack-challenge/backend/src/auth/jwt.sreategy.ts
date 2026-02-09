import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Request as RequestType } from "express";
import { Injectable } from "@nestjs/common";
import { loginDTO } from "./dto/login.dto";

export const JwtSecretTMP = 'secretKey';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken()
            ]),
            ignoreExpiration: false,
            secretOrKey: JwtSecretTMP
        });
    }

    private static extractJWT(req: RequestType): string | null {
        if (req.cookies && 'user_token' in req.cookies && req.cookies.user_token.length > 0) {
            return req.cookies.user_token;
        }
        return null;
    }

    async validate(payload: loginDTO & { id: string }) {
        return { userId: payload.id, email: payload.email, password: payload.password };
    }
}