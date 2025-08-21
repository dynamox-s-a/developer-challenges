import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';


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

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'All users' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAllUsers() {
    return this.authService.findAllUsers();
  }
}
