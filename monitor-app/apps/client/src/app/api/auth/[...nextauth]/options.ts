import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options: NextAuthOptions = {
  pages: {
    signIn: '/'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'E-mail', type: 'text', placeholder: 'user@email.com' },
        userPassword: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        const options: RequestInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        }
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/login', options)
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Error: Login failed. Incorrect e-mail or password')
          }
          throw new Error(`Error! ${response.status}: ${response.statusText}`)
        }
        const user = response.json()
        return user
      }
    })
  ]
}
