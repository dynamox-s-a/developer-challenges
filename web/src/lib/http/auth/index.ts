import { loginPost } from './services/login'
import { registerPost } from './services/register'
import type {
  loginRequest,
  loginResponse,
  registerRequest,
  registerResponse,
} from '@/lib/http/auth/types'

class AuthService {
  async login(body: loginRequest): Promise<loginResponse> {
    return await loginPost(body)
  }

  async register(body: registerRequest): Promise<registerResponse> {
    return await registerPost(body)
  }
}

export const authService = new AuthService()
