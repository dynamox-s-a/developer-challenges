import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service'; // Import UserService
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  /**
   * Validates a user's credentials.
   * @param email - The email of the user to validate.
   * @param password - The password of the user to validate.
   * @returns The user object if the credentials are valid, otherwise null.
   */
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
