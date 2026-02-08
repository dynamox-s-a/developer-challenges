import { LoginService } from './services/login'
import { RegisterService } from './services/register'
import type { loginRequest, loginResponse, registerRequest } from './types'

class AuthService {
  private loginService: LoginService
  private registerService: RegisterService

  constructor() {
    this.loginService = new LoginService()
    this.registerService = new RegisterService()
  }

  async login(body: loginRequest): Promise<loginResponse> {
    return await this.loginService.loginPost(body)
  }

  async register(body: registerRequest): Promise<registerRequest> {
    return await this.registerService.registerPost(body)
  }
}

export const authService = new AuthService()
