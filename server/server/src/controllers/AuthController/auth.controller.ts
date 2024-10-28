import { PrismaAuthRepository } from 'src/repositories/prisma/prisma.auth.repository';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as CryptoJS from 'crypto-js';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

function cleanString(input: string): string {
  let cleanedString = input.replace(/\\/g, '');

  cleanedString = cleanedString.replace(/^"|"$/g, '');

  return cleanedString;
}
@Controller('auth')
class AuthControler {
  constructor(private readonly authRepository: PrismaAuthRepository) {}

  @Post('register')
  async register(@Body() user: User) {
    try {
      let newUser: Omit<User, 'id'> = {
        email: user.email,
        password: user.password,
      };

      const bytes = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET_CRYPTO_KEY || 'secret',
      );
      const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
      newUser.password = decryptedPassword;

      await this.authRepository.create(newUser);

      return {
        message: 'User created!',
        user: {
          email: newUser.email,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating the user, verify!. ' + error,
      );
    }
  }
  @Post('login')
  async login(@Body() user: User) {
    try {
      const sendedUser: Omit<User, 'id'> = {
        email: user.email,
        password: user.password,
      };

      const bytes = CryptoJS.AES.decrypt(
        sendedUser.password,
        process.env.SECRET_CRYPTO_KEY || 'secret',
      );

      const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
      sendedUser.password = cleanString(decryptedPassword);

      let loggedUser = await this.authRepository.login(sendedUser);
      return {
        message: 'Ok!',
        token: loggedUser.access_token,
      };
    } catch (err: any) {
      throw new InternalServerErrorException(
        'Invalid email or password. Verify!.',
      );
    }
  }
}
export default AuthControler;
