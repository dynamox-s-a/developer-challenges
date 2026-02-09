import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JWTGuard extends AuthGuard("jwt") {
    handleRequest(error, user) {
        if(!user || error) {
            throw error || new UnauthorizedException("User not logged to access this route")
        }
        return user;
    }
}