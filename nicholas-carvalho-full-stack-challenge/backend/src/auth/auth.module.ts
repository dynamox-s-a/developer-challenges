import { Module } from "@nestjs/common";
import { JwtStrategy } from "./jwt.sreategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: "jwt", session: false }),
        JwtModule.register({ secret: "secretKey", signOptions: { expiresIn: "2h" } })
    ],
    providers: [JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule { }