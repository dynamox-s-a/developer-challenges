import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

interface SessionRequest extends Request {
  session: {
    user: User;
  };
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Retrieves the currently authenticated user.
   * @param req - The request object containing the session.
   * @returns The currently authenticated user.
   */
  @Get('me')
  async getMe(@Req() req: SessionRequest) {
    const user = req.session.user;
    if (!user) {
      console.log('user', user);
      throw new Error('No user is currently authenticated');
    }
    console.log('user', user);
    return this.userService.getMe(user);
  }

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
