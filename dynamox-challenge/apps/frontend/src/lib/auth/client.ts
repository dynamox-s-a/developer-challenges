'use client';

import type { User } from '@/types/user';

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
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    return { error: 'Sign up should be handled by Redux RTK Query' };
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(_: SignInWithPasswordParams): Promise<{ error?: string }> {
    return { error: 'Sign in should be handled by Redux RTK Query' };
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Check if we have a token in localStorage (same key as Redux uses)
    const token = localStorage.getItem('token');

    if (!token) {
      return { data: null };
    }

    // Try to fetch user data from the API
    try {
      const response = await fetch('http://localhost:4000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token is invalid, remove it
        localStorage.removeItem('token');
        return { data: null };
      }

      const userData = await response.json();

      // Transform backend user format to frontend User type
      return {
        data: {
          id: userData.id.toString(),
          email: userData.email,
          firstName: userData.name?.split(' ')[0] || '',
          lastName: userData.name?.split(' ').slice(1).join(' ') || '',
          avatar: userData.avatar || undefined,
        }
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return { data: null, error: 'Failed to fetch user data' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('token');
    return {};
  }
}

export const authClient = new AuthClient();
