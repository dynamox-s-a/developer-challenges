import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Post()
  async auth(@Body() reqData: { email: string; password: string; }): Promise<UserModel> {
    const { email, password } = reqData;
    return this.userService.getUser({
      email,
      password
    });
  }
}