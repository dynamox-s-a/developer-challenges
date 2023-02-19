import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
   CredentialsProvider({

        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text", placeholder: "jsmith@gm.com" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          const { email, password} = credentials as any;
          const res = await fetch(`http://localhost:3004/users?email=${email}`, {
            method: 'POST',
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify({
                email, 
                password
            }),
          });

          const user = await res.json(); 
          if(res.ok && user) {
            return user
          } else return null;
        }
      })
    
  ],
  session:{
    strategy:'jwt'
  },
  pages: {
    signOut:"/"
  }
}
export default NextAuth(authOptions)
