import NextAuth from 'next-auth';
import { api } from '../../../services/api';
import { NextApiRequest, NextApiResponse } from 'next';
import CredentialsProvider from 'next-auth/providers/credentials';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: {
            label: 'Email',
            type: 'email',
          },
          password: {
            label: 'Password',
            type: 'password',
          },
        },
        async authorize(credentials, req) {
          if (!credentials?.email || !credentials.password) return null;

          try {
            const response = await api.post('/sessions', credentials);

            const { user, accessToken } = response.data;

            if (!user || !accessToken) return null;

            api.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

            return user;
          } catch (error) {
            console.error(error);
            return null;
          }
        },
      }),
    ],
    session: {
      strategy: 'jwt',
      maxAge: 1 * 24 * 60 * 60, // 1 day
    },
    secret: process.env.JWT_SECRET,
    cookies: {
      sessionToken: {
        name: '@dynamox-challenge:sessionToken',
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        },
      },
    }
  })
}
