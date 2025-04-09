import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({
    description: 'User data',
    schema: {
      example: {
        email: 'userEmail@email.com',
        password: '12345',
      },
    },
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, description: 'User signed in' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({
    description: 'User data',
    schema: {
      example: {
        email: 'email@email.com',
        password: '12345',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }
}
