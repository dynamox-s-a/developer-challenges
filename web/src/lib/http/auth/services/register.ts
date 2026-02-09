import {
  type registerResponse,
  registerResponseSchema,
  type registerRequest,
} from '@/lib/http/auth/services/auth.types'

export class RegisterService {
  async registerPost(body: registerRequest): Promise<registerResponse> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    const validatedResponse = registerResponseSchema.parse(data)
    console.log(validatedResponse)
    return validatedResponse
  }
}
