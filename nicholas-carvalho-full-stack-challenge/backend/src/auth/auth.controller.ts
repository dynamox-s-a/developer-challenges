import { Body, Controller, Get, Post, Res, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { loginDTO } from "./dto/login.dto";

@Controller("/auth")
export class AuthController {
    constructor(private jwtService: JwtService) { }

    @Post('login')
    async login(@Res({ passthrough: true }) res, @Body() data: loginDTO) {
        if(data.email != "admin@dynamox.com" || data.password != "123456") {
            throw new UnauthorizedException("Credentials are invalid!");
        }
        
        const payload = { ...data, id: "123" };
        res.cookie("user_token", this.jwtService.sign(payload), {
            expiresIn: Date.now() + 3600000
        });
        
        return { message: "Login with sucess!", user: payload };
    }

    @Get("logout")
    async logout(@Res({ passthrough: true }) res) {
        res.clearCookie("user_token");
        return { message: "Logout sucessfully!"};
    }
}