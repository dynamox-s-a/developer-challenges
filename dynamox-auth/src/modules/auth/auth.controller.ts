
import { Body, Controller, Post, HttpCode, HttpStatus, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'modules/decorators/setMetadata.decorator';
import type { Request as ExpressRequest, Response } from 'express';

interface RequestWithUser extends ExpressRequest {
  user?: string;
}

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Get('validate')
  validateToken(@Req() req: RequestWithUser, @Res() res: Response) {
    res.setHeader('X-Auth-User', JSON.stringify(req.user));

    return res.send(true);
  }
}