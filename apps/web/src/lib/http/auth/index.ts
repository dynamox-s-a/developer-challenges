import { LoginService } from './loginService'
import { RegisterService } from './registerService'
import type { loginRequest, registerRequest } from './types'

class AuthService {
  private loginService: LoginService
  private registerService: RegisterService

  constructor() {
    this.loginService = new LoginService()
    this.registerService = new RegisterService()
  }

  async login(body: loginRequest): Promise<string> {
    return await this.loginService.loginPost(body)
  }

  async register(body: registerRequest): Promise<registerRequest> {
    return await this.registerService.registerPost(body)
  }
}

export const authService = new AuthService()
