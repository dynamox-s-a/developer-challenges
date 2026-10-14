import type { AuthUser } from "@full-stack-solution/shared";
import type { PrismaClient } from "../../generated/prisma/client";

export interface UserCredentials extends AuthUser {
  password: string;
}

export interface AuthRepository {
  findCredentialsByEmail(email: string): Promise<UserCredentials | null>;
  findById(id: string): Promise<AuthUser | null>;
}

export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findCredentialsByEmail(email: string): Promise<UserCredentials | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });
  }

  findById(id: string): Promise<AuthUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true },
    });
  }
}
