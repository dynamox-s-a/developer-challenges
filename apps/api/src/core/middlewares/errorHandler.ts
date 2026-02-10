import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { ResponseBase } from '../base/response.base'
import { AppError } from '../base/AppError'

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json(ResponseBase.error(err.format(), 'Validation error'))
  }

  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(ResponseBase.error(err.details ?? null, err.message))
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res
        .status(409)
        .json(
          ResponseBase.error(
            { target: err.meta?.target },
            'Unique constraint violation'
          )
        )
    }

    if (err.code === 'P2025') {
      return res.status(404).json(ResponseBase.error(null, 'Record not found'))
    }
  }

  console.error(err)
  return res.status(500).json(ResponseBase.error(null, 'Internal server error'))
}
