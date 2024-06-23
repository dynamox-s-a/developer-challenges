
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"


export default {
  providers: [
    
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null
        
        const payLoad = {
          email: credentials.email,
          password: credentials.password,
        } 

        user = await fetch("http://localhost:3001/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payLoad),
        }).then((res) => res.json())
        
        console.log(user)

        if (!user) {
          throw new Error("Credenciais inválidas ou usuário não encontrado")
        }
        return user
      },
    }),
  ]


} satisfies NextAuthConfig