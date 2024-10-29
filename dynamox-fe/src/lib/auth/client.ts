'use client';

import Cookies from 'js-cookie';
import type { User } from '@/types/user';
import authService from '@/services/auth';

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Dynamox',
  lastName: 'Test',
  email: 'dynamox@email.com',
} satisfies User;

export interface SignUpParams {
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const response = await authService.login(params);

    const {access_token} = response.data;

    Cookies.set("authorization", access_token, {
      expires: 7,
    });

    return {};
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {

    const token = Cookies.get('authorization');

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    Cookies.remove('authorization');

    return {};
  }
}

export const authClient = new AuthClient();
