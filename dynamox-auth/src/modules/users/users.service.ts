import { Injectable } from '@nestjs/common';

export type User = {
    id: number,
    username: string
    email: string,
    password: string
};

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      username: 'Dynamox User',
      email: 'dynamox@email.com',
      password: 'dynamox123',
    },
  ];

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }
}