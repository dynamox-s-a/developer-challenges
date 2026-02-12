import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { ResponseBase } from '../base/response.base'
import { AppError } from '../base/AppError'

type ValidationErrorPayload = {
  type: 'VALIDATION_ERROR'
  fields: Record<string, string[]>
  formErrors: string[]
}

function toStartCase(input: string) {
  return input
    .replace(/[_-]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^\w/, (c) => c.toUpperCase())
}

function getIssueMessage(issue: z.core.$ZodIssue): string {
  const field = issue.path.length
    ? toStartCase(String(issue.path[issue.path.length - 1]))
    : 'Valor'

  if (issue.message && !issue.message.startsWith('Too ')) {
    return issue.message
  }

  switch (issue.code) {
    case 'invalid_type':
      return `${field} possui tipo inválido`
    case 'too_small':
      if (issue.origin === 'string') {
        return `${field} deve ter no mínimo ${issue.minimum} caracteres`
      }
      if (issue.origin === 'array') {
        return `${field} deve ter no mínimo ${issue.minimum} itens`
      }
      return `${field} é muito curto`
    case 'too_big':
      if (issue.origin === 'string') {
        return `${field} deve ter no máximo ${issue.maximum} caracteres`
      }
      if (issue.origin === 'array') {
        return `${field} deve ter no máximo ${issue.maximum} itens`
      }
      return `${field} é muito longo`
    case 'invalid_format':
      return `${field} possui formato inválido`
    default:
      return issue.message || 'Valor inválido'
  }
}

function normalizeZodError(error: ZodError): {
  message: string
  payload: ValidationErrorPayload
} {
  const fields: Record<string, string[]> = {}
  const formErrors: string[] = []

  for (const issue of error.issues) {
    const key = issue.path.join('.')
    const message = getIssueMessage(issue)

    if (!key) {
      formErrors.push(message)
      continue
    }

    if (!fields[key]) fields[key] = []
    fields[key].push(message)
  }

  return {
    message: 'Erro de Validação',
    payload: {
      type: 'VALIDATION_ERROR',
      fields,
      formErrors
    }
  }
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    const normalized = normalizeZodError(err)
    return res
      .status(400)
      .json(ResponseBase.error(normalized.payload, normalized.message))
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
            'Violação de restrição única'
          )
        )
    }

    if (err.code === 'P2025') {
      return res
        .status(404)
        .json(ResponseBase.error(null, 'Registro não encontrado'))
    }
  }

  console.error(err)
  return res
    .status(500)
    .json(ResponseBase.error(null, 'Erro interno do servidor'))
}
