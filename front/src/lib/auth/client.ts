'use client';

import type { User } from '@/types/user';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string, token?: string }> {
    const { name, email, password } = params;

    const response = await fetch('http://localhost:3001/user/sign_up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || 'Error occurred while signing in' };
    }

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    document.cookie = `custom-auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; secure; SameSite=Strict`;

    return {token};
  }


  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string, token?: string }> {
    const { email, password } = params;

    const response = await fetch('http://localhost:3001/user/sign_in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || 'Error occurred while signing in' };
    }

    const data = await response.json();

    const token = generateToken();
    document.cookie = `custom-auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; secure; SameSite=Strict`;

    return { token };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
