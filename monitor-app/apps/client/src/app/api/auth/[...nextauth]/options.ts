import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

type FetchErrorResponseProps = {
  message: string
}

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
      async authorize(credentials) {
        const options: RequestInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        }
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/login', options)

        if (!response.ok) {
          const apiError: FetchErrorResponseProps = await response.json()
          const { message } = apiError
          throw new Error(`${message}`)
        }
        const user = response.json()
        return user
      }
    })
  ]
}
