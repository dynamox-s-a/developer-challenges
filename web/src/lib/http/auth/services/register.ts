import { registerRequestSchema, type registerRequest } from '../types'

export class RegisterService {
  async registerPost(body: registerRequest): Promise<registerRequest> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const parsedResponse = await response.json()
    const validatedResponse = registerRequestSchema.parse(parsedResponse.data)
    return validatedResponse
  }
}
