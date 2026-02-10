import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from './jwt'
import { ResponseBase } from '../base/response.base'

export interface AuthPayload {
  userUuid: string
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return res
      .status(401)
      .json(ResponseBase.error(null, 'Missing Bearer token'))
  }

  try {
    const token = header.replace('Bearer ', '')
    const payload = verifyAccessToken(token) as AuthPayload

    ;(req as any).auth = payload
    next()
  } catch (err) {
    return res.status(401).json(ResponseBase.error(err, 'Invalid token'))
  }
}
