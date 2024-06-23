import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { LoginRequestBody } from './model/LoginRequestBody';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';



@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() { email, password }: LoginRequestBody) {
        return this.authService.login(email, password);
    }
}
