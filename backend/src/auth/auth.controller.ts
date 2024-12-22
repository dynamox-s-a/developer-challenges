import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  /**
   * Constructs an instance of AuthController.
   * @param authService - The authentication service.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Handles user login.
   * @param body - The login credentials containing email and password.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A JSON response indicating the result of the login attempt.
   */
  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (user) {
      req.session.user = user;
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  }

  /**
   * Handles user logout.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A JSON response indicating the result of the logout attempt.
   */
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Could not log out' });
      }
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  }
}
