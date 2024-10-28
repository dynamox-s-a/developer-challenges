import { User } from '@prisma/client';

export abstract class AuthRepostory {
  abstract create(user: User): Promise<void>;
  abstract login(user: User): Promise<{ access_token: string }>;
}
