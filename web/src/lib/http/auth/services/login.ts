import {
  type loginResponse,
  loginResponseSchema,
  type loginRequest,
} from '@/lib/http/auth/services/auth.types'

export class LoginService {
  async loginPost(body: loginRequest): Promise<loginResponse> {
    console.log(JSON.stringify(body))

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const responseJson = await response.json()
    console.log(responseJson)
    const validatedValue = loginResponseSchema.parse(responseJson)
    return validatedValue
  }
}
