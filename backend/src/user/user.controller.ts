import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Retrieves a user by their email.
   * @param email - The email of the user to retrieve.
   * @returns The user with the specified email.
   */
  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  /**
   * Creates a new user.
   * @param body - The request body containing the user's email and password.
   * @returns The created user.
   */
  @Post('create')
  async createUser(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.userService.createUser(email, password);
  }
}
