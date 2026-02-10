import bcrypt from 'bcrypt'
import { prisma } from '../../core/lib/prisma'
import { signAccessToken } from '../../core/auth/jwt'
import type { LoginInput, RegisterInput } from './auth.schemas'

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) return null

  const valid = await bcrypt.compare(input.password, user.passwordHash)
  if (!valid) return null

  const token = signAccessToken({ userUuid: user.uuid })

  return {
    token,
    user: { uuid: user.uuid, name: user.name, email: user.email }
  }
}

export async function getMe(userUuid: string) {
  return prisma.user.findUnique({
    where: { uuid: userUuid },
    select: { uuid: true, name: true, email: true, createdAt: true }
  })
}

export async function register(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email }
  })

  if (existingUser) {
    return null
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
