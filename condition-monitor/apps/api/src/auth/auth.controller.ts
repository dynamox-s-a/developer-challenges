import { Body, Controller, Get, HttpCode, Inject, Post, Res } from '@nestjs/common';
import { loginRequestSchema, type SessionUser } from '@condition-monitor/shared';
import type { CookieOptions, Response } from 'express';
import { createZodDto } from 'nestjs-zod';
import { AUTH_CONFIG, type AuthConfig } from '../config/auth-config';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { Public } from './public.decorator';
import { SESSION_COOKIE, SESSION_COOKIE_PATH } from './session';

class LoginDto extends createZodDto(loginRequestSchema) {}

/** Authentication routes of the API contract, with the session in a cookie (ADR 0008). */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(204)
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { token } = await this.auth.login(body);
    response.cookie(SESSION_COOKIE, token, {
      ...this.cookieOptions(),
      maxAge: this.config.sessionTtlSeconds * 1000,
    });
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(SESSION_COOKIE, this.cookieOptions());
  }

  @Get('me')
  me(@CurrentUser() user: SessionUser): Promise<SessionUser> {
    return this.auth.me(user.id);
  }

  /** Page scripts cannot read the cookie, and other sites never send it (A2). */
  private cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      sameSite: 'strict',
      secure: this.config.secureCookie,
      path: SESSION_COOKIE_PATH,
    };
  }
}
