'use client';

import axios from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

import type { User } from '@/types/user';

export interface SignUpParams {
  email: string;
  password: string;
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

const TOKEN_COOKIE_NAME = 'auth-token';
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 30 * 24 * 60 * 60, // 30 days
  path: '/',
};

class AuthClient {
  private apiUrl: string;

  constructor() {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API URL is not defined in environment variables.');
    }
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL;
  }

  private decodeToken(token: string) {
    try {
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(atob(payloadBase64));
      return payload;
    } catch {
      return null;
    }
  }

  private isTokenExpired(payload: { exp?: number }): boolean {
    try {
      return payload.exp ? payload.exp * 1000 < Date.now() : true;
    } catch {
      return true;
    }
  }

  async signUp(params: SignUpParams): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.post(`${this.apiUrl}/user`, params, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        return { success: true };
      } else {
        return { success: false, error: 'Unexpected response from server.' };
      }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Sign up failed.' };
    }
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.post(`${this.apiUrl}/auth/login`, params, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 && response.data.access_token) {
        console.log('Setting token:', response.data.access_token);
        setCookie(TOKEN_COOKIE_NAME, response.data.access_token, COOKIE_OPTIONS);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid response from server.' };
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.response?.data?.message || 'Sign in failed.' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      deleteCookie(TOKEN_COOKIE_NAME);
      return {};
    } catch (error: any) {
      return { error: 'Sign out failed.' };
    }
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = this.getToken();

    if (!token) {
      return { data: null };
    }

    const decoded = this.decodeToken(token);
    if (!decoded) {
      this.signOut();
      return { data: null, error: 'Invalid token format' };
    }

    if (this.isTokenExpired(decoded)) {
      this.signOut();
      return { data: null, error: 'Session expired' };
    }

    if (!decoded.email || !decoded.sub) {
      this.signOut();
      return { data: null, error: 'Invalid token payload' };
    }

    return {
      data: {
        id: decoded.sub,
        email: decoded.email,
      },
    };
  }

  getToken(): string | null {
    return getCookie(TOKEN_COOKIE_NAME)?.toString() ?? null;
  }
}

export const authClient = new AuthClient();
