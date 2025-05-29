import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDTO, SignUpDTO } from './dto/auth';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}  

  @Post('login')
  async login(@Body() body: LoginDTO) {    
    return this.authService.login(body);   
  }

  @Post('signup')
  async signup(@Body() body: SignUpDTO){
    return this.authService.signup(body);    
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Request() request){
    return request.user;
  }
}
