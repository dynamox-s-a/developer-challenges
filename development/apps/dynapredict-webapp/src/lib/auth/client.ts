'use client';

import axios from 'axios';

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

interface APIResponse {
  error?: string;
  message?: string;
  data?: {
    id?: number;
    name?: string;
    email?: string;
  };
}

class AuthClient {
  private apiUrl: string;

  constructor() {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API URL is not defined in environment variables.');
    }
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL;
  }

  async signUp(params: SignUpParams): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.post(`${this.apiUrl}/users`, params, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        const token = JSON.stringify(response.data);

        localStorage.setItem('custom-auth-token', token);
        return { success: true };
      }
      return { success: false, error: 'Unexpected response from server.' };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as APIResponse;
        return { success: false, error: errorData.error };
      }
      return { success: false, error: 'Sign up failed.' };
    }
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;

    if (email !== 'sofia@devias.io' || password !== 'Secret1') {
      return { error: 'Invalid credentials' };
    }

    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  /*eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access*/

  async getUser(): Promise<{ data?: User | null; error?: string | number }> {
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    try {
      const response = await axios.get(`${this.apiUrl}/users/${JSON.parse(token || '').id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        //eslint-disable-next-line
        console.log(response.data);

        return { data: { id: response.data.id, email: response.data.email, avatar: 'null', name: response.data.name } };
      }
      return { error: response.status, data: response.data };
    } catch (error: unknown) {
      localStorage.removeItem('custom-auth-token');
      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as APIResponse;
        
        return { error: errorData.error, data: null };
      }
      return { error: 'Sign up failed.', data: null };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }

  async DeleteUser(): Promise<{ error?: string | number; message?: string }> {
    try {
      const response = await axios.delete(`${this.apiUrl}/users/${(await this.getUser()).data?.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        //eslint-disable-next-line
        console.log(response.data);
        localStorage.removeItem('custom-auth-token');
        return { message: response.data };
      }
      return { error: response.status, message: response.data };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as APIResponse;
        return { error: errorData.error, message: errorData.message };
      }
      return { error: 'Sign up failed.' };
    }
  }
}

/*eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access*/

export const authClient = new AuthClient();
