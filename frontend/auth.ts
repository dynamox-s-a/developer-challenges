import NextAuth from "next-auth"
import authConfig from "./auth.config";
 
export const { 
  handlers: {GET, POST}, 
  signIn, 
  signOut, 
  auth, 
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async signIn({user}) {
      console.log("signIn", user);
      if (!user) {
        return false;
      }
      return true;
    },

    async session({session, token, user}) {
      console.log("session", session);
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      session.user.name = user.name


      return session;
    },
    async jwt({ token, user }) {
      console.log("jwt", token);
      token.name = user.name;
      token.email = user.email;
      return token;
    }
  },
  session: {strategy: "jwt"},
  ...authConfig
})
