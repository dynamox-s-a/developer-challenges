import {
  Controller,
  HttpCode,
  Post,
  Request,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import type { ValidatedUser } from '../auth/auth.service';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @HttpCode(200)
  async login(@Request() req) {
    return this.authService.login(req.user as ValidatedUser);
  }
}
