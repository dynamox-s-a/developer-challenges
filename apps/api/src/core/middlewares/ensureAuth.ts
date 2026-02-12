import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from '../base/AppError'
import { prisma } from '../lib/prisma'

type JwtPayload = {
  userUuid: string
  iat: number
  exp: number
}

export async function ensureAuth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) throw new AppError('Não autorizado', 401)

  const token = header.substring('Bearer '.length)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

    const user = await prisma.user.findUnique({
      where: { uuid: payload.userUuid },
      select: { id: true, uuid: true }
    })

    if (!user) {
      throw new AppError('Usuário não encontrado', 401)
    }

    req.user = user

    return next()
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError('Não autorizado', 401)
  }
}
