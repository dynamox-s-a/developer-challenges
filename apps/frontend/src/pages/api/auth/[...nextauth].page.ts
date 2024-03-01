import NextAuth from 'next-auth';
import { User } from '@prisma/client';
import { createSession } from '../../../services/api';
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { user, accessToken }: any = await createSession(credentials);

            if (!user || !accessToken) return null;

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
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.user = user;
        }
        return token;
      },
      async session({ session, token }) {
        if (token && token.user) {
          session.user = token.user as User;
        }
        return session;
      },
    },
  })
}
