import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Session, User, JWT } from "next-auth";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        const validEmail = "user@example.com";
        const validPassword = "password123";

        if (email === validEmail && password === validPassword) {
          return { id: "1", name: "João da Silva", email: validEmail };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
      } else {
        session.user = { id: token.id, email: token.email };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});
