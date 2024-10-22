import { api } from '../../services/api';
import type { User } from '../../types/user';

const user = {
  email: '',
} satisfies User;

export interface SignUpParams {
  email: string;
  password: string;
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}


class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    const apiResponse =  await api.post('/user', {
      email: _.email,
      password: _.password,
    })
    console.log(apiResponse);

    return {};
  }


  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ token?: string; error?: string }> {
    const { email, password } = params;

    try{
      const apiResponse = await api.post('/auth/login', {
        email: email,
        password: password,
      });
      console.log(apiResponse);
      const token = apiResponse.data.access_token;
      localStorage.setItem('access_token', token);

      return { token };
    } catch (error) {
      return { error: 'Invalid credentials please try again.' };
    }
  }


  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('access_token');

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('access_token');

    return {};
  }
}

export const authClient = new AuthClient();
