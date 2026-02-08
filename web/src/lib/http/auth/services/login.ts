import {
  type loginResponse,
  loginResponseSchema,
  type loginRequest,
} from '../types'

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
    const validatedValue = loginResponseSchema.parse(responseJson.data)
    return validatedValue
  }
}
