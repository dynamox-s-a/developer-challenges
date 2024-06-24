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
    async signIn({ user, account, profile, email, credentials }) {
  
      if (!user) {
        return false;
      }

      if (account && account.accessToken) {
        (user as any).accessToken = account.accessToken;
      }

      // Manually add email and name if they are not present in user object
      if (!user.email && email) {
        user.email = email;
      }

      if (!user.name && profile) {
        user.name = profile.name;
      }

      console.log("signIn updated user", user);

      return true;
    },
    async jwt({ token, user }) {
      console.log("jwt user", user);

      if (user) {
        token.sub = user.id; 
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = (user as any).accessToken;
      }

      console.log("jwt token", token);
      return token;
    },
    async session({ session, token }) {
      console.log("session before assignment", session);
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
        };
        session.accessToken = token.accessToken;
      }
      console.log("session after assignment", session);
      return session;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
