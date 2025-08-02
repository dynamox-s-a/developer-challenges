'use client';

import type { User } from '@/types/user';

const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export interface SignUpParams {
  firstName: string;
  lastName: string;
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
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    const { email, password, firstName, lastName } = params;
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
        credentials: 'include', // Include cookies in the request
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Registration failed' };
      }

      return {};
    } catch (error) {
      return { error: 'Network error. Please try again.' };
    }
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies in the request
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Login failed' };
      }

      // Cookie is automatically set by the browser when credentials: 'include' is used
      return {};
    } catch (error) {
      return { error: 'Network error. Please try again.' };
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/me`, {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });
      if (!response.ok) {
        if (response.status === 401) {
          return { data: null }; // User not authenticated
        }
        const data = await response.json();
        return { error: data.error || 'Failed to get user' };
      }
      const userData = await response.json();
      return { data: userData };
    } catch (error) {
      return { error: 'Network error. Please try again.' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        const data = await response.json();
        return { error: data.error || 'Logout failed' };
      }

      return {};
    } catch (error) {
      return { error: 'Network error. Please try again.' };
    }
  }
}

export const authClient = new AuthClient();
