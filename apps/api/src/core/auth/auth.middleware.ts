import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from './jwt'
import { ResponseBase } from '../base/response.base'
import { prisma } from '../lib/prisma'

export interface AuthPayload {
  userUuid: string
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return res
      .status(401)
      .json(ResponseBase.error(null, 'Missing Bearer token'))
  }

  try {
    const token = header.replace('Bearer ', '')
    const payload = verifyAccessToken(token) as AuthPayload

    const user = await prisma.user.findUnique({
      where: { uuid: payload.userUuid },
      select: { id: true, uuid: true }
    })

    if (!user) {
      return res.status(401).json(ResponseBase.error(null, 'User not found'))
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json(ResponseBase.error(null, 'Invalid token'))
  }
}
