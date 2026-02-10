import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from '../base/AppError'

type JwtPayload = {
  userUuid: string
  iat: number
  exp: number
}

export function ensureAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) throw new AppError('Unauthorized', 401)

  const token = header.substring('Bearer '.length)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    ;(req as any).userUuid = payload.userUuid
    return next()
  } catch {
    throw new AppError('Unauthorized', 401)
  }
}
