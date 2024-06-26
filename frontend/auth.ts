import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { 
  handlers: { GET, POST }, 
  signIn, 
  signOut, 
  auth, 
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async signIn({ user }) {
   
      if (!user) {
        return false;
      }
      return true;
    },

    async jwt({ token, user, account }) {
    

      if (account && user) {
        //@ts-ignore
        token.accessToken = user.acessToken;
        //@ts-ignore
        token.userData = user.userData;
      }

      return token;
    },

    async session({ session, token }) {

      session.accessToken = token.accessToken;
      session.user = token.userData;

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
