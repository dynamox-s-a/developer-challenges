import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  pages: {
    signIn: '/',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const { AUTH_USER_EMAIL, AUTH_USER_PASSWORD } = process.env;

        if (
          credentials.email === AUTH_USER_EMAIL &&
          credentials.password === AUTH_USER_PASSWORD
        ) {
          return {
            id: '1',
            email: AUTH_USER_EMAIL,
          };
        }

        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
