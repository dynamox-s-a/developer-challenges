import { Controller, Post, Body } from '@nestjs/common'
import { LoginService } from './login.service'
import { LoginDto } from './dto/login.dto'

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  login(@Body() { email, userPassword }: LoginDto) {
    return this.loginService.authenticate({ email, userPassword })
  }
}
