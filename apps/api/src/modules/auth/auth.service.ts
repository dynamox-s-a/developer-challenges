import bcrypt from 'bcrypt'
import { prisma } from '../../core/lib/prisma'
import { signAccessToken } from '../../core/auth/jwt'
import { AppError } from '../../core/base/AppError'
import type { LoginInput, RegisterInput } from './auth.schemas'

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) {
    throw new AppError('Credenciais inválidas', 401)
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash)
  if (!valid) {
    throw new AppError('Credenciais inválidas', 401)
  }
  const token = signAccessToken({ userUuid: user.uuid })

  return {
    token,
    user: { uuid: user.uuid, name: user.name, email: user.email }
  }
}

export async function getMe(userUuid: string) {
  const user = await prisma.user.findUnique({
    where: { uuid: userUuid },
    select: { uuid: true, name: true, email: true, createdAt: true }
  })

  if (!user) {
    throw new AppError('Usuário não encontrado', 404)
  }

  return user
}

export async function register(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email }
  })

  if (existingUser) {
    throw new AppError('Usuário já existe', 409)
  }

  const passwordHash = await bcrypt.hash(input.password, 10)

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash
    },
    select: {
      uuid: true,
      email: true,
      createdAt: true,
      name: true
    }
  })

  return {
    user
  }
}
