import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class LoginService {
  constructor(private prisma: PrismaService) {}

  async authenticate({ email, userPassword }: LoginDto) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({ where: { email: email } })
      const isPasswordMatch = await bcrypt.compare(userPassword, user.password)
      if (!isPasswordMatch) {
        throw new UnauthorizedException('Error: Access Denied')
      }
      const { password, ...session } = user
      return session
    } catch (error) {
      throw new UnauthorizedException('Error: Access Denied')
    }
  }
}
