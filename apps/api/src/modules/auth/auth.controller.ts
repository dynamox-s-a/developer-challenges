import type { Request, Response } from 'express'
import { ResponseBase } from '../../core/base/response.base'
import { loginSchema, registerSchema } from './auth.schemas'
import * as authService from './auth.service'

export async function login(req: Request, res: Response) {
  const input = loginSchema.parse(req.body)
  const result = await authService.login(input)
  return res.json(ResponseBase.success(result, 'Login successful'))
}

export async function me(req: Request, res: Response) {
  const user = await authService.getMe(req.user.uuid)
  return res.json(ResponseBase.success(user, 'Authenticated user'))
}

export async function register(req: Request, res: Response) {
  const input = registerSchema.parse(req.body)
  const result = await authService.register(input)
  return res
    .status(201)
    .json(ResponseBase.success(result, 'Registration successful'))
}
