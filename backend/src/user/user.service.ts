import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Finds a user by their email address.
   * @param email - The email address of the user to find.
   * @returns A promise that resolves to the user if found, or null if not found.
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Creates a new user with the given email and password.
   * @param email - The email address of the new user.
   * @param password - The password of the new user.
   * @returns A promise that resolves to the created user.
   */
  async createUser(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }
}
