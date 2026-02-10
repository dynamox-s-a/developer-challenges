import type { Request, Response } from 'express'
import { ResponseBase } from '../../core/base/response.base'
import { loginSchema, registerSchema } from './auth.schemas'
import * as authService from './auth.service'

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res
      .status(400)
      .json(ResponseBase.error(parsed.error, 'Invalid payload'))
  }

  const result = await authService.login(parsed.data)
  if (!result) {
    return res.status(401).json(ResponseBase.error(null, 'Invalid credentials'))
  }

  return res.json(ResponseBase.success(result, 'Login successful'))
}

export async function me(req: Request, res: Response) {
  const { userUuid } = (req as any).auth

  const user = await authService.getMe(userUuid)
  if (!user) {
    return res.status(404).json(ResponseBase.error(null, 'User not found'))
  }

  return res.json(ResponseBase.success(user, 'Authenticated user'))
}

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res
      .status(400)
      .json(ResponseBase.error(parsed.error, 'Invalid payload'))
  }

  const result = await authService.register(parsed.data)
  if (!result) {
    return res
      .status(400)
      .json(ResponseBase.error(null, 'Email already registered'))
  }

  return res
    .status(201)
    .json(ResponseBase.success(result, 'Registration successful'))
}
