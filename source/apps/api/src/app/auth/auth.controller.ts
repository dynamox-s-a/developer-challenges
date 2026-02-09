import { Controller, Post, Body, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; pass: string }) {
    const user = await this.authService.validateUser(body.email, body.pass);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('signup')
  async signup(@Body() body: { email: string; pass: string; name?: string }) {
    try {
      return await this.authService.signup(body.email, body.pass);
    } catch (error) {
      console.error('Signup error:', error);
      return { message: error.message };
    }
  }


  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    // TODO:
    // 1. Extract token and add to Redis blacklist (optional for now)
    // 2. Clear the HttpOnly cookie
    res.setHeader('Set-Cookie', 'access_token=; HttpOnly; Path=/; Max-Age=0');
    return res.status(200).send({ message: 'Logged out successfully' });
  }
}
