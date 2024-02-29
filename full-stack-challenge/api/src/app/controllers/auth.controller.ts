import {
  Controller,
  HttpCode,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBasicAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { getDomain } from 'api/src/app/core/helpers/get-domain';
import { DateTime } from 'luxon';
import { PublicEndpoint } from '../core/decorators/public-endpoint.decorator';
import AuthService from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicEndpoint()
  @UseGuards(AuthGuard('basic'))
  @Post('login')
  @HttpCode(200)
  @ApiBasicAuth('basicAuth')
  @ApiResponse({
    status: 200,
    description: 'Access token created',
  })
  @ApiResponse({
    status: 401,
    description: 'Check returned body for details',
  })
  async login(@Request() request, @Response() response): Promise<any> {
    const generatedToken = await this.authService.generateAccessToken(
      request.user
    );

    response
      .cookie('adminAccessToken', generatedToken.accessToken, {
        expires: DateTime.local().plus({ days: 1 }).toJSDate(),
        domain: getDomain(request.hostname),
      })
      .send(generatedToken);
  }

  @Post('logout')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Credentials cleaned',
  })
  @UseGuards(AuthGuard('bearerAdmin'))
  async logout(@Request() request, @Response() response): Promise<void> {
    response
      .cookie('adminAccessToken', '', {
        expires: DateTime.local().minus({ days: 1 }).toJSDate(),
        domain: getDomain(request.hostname),
      })
      .sendStatus(200);
  }
}
