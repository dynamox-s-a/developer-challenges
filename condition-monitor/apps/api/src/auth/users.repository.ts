import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
}

/** The only place that queries the users table (ADR 0002). */
@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true },
    });
  }

  findById(id: string): Promise<{ id: string; email: string } | null> {
    return this.prisma.user.findUnique({ where: { id }, select: { id: true, email: true } });
  }
}
