import { type NextRequest, NextResponse } from 'next/server'
import { loginRequestSchema } from '@/lib/http/auth/types'
import userRepository from '@/lib/database/user/repository'
import jwt from 'jsonwebtoken'
import '@/utils/env'
import dbConnect from '@/lib/database/mongoose'

// export const loginResponseSchema = z.object({
//   success: z.boolean(),
//   data: loginRequestSchema.optional(),
//   message: z.string(),
//   error: z.string().optional(),
// })

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const validatedData = loginRequestSchema.parse(body)
    const user = await userRepository.findByEmail(validatedData)

    if (!user)
      return NextResponse.json(
        {
          success: false,
          message: 'Erro na autenticação do usuário.',
        },
        { status: 400 },
      )

    const JWT_SECRET = process.env.JWT_SECRET
    const JWT_EXPIRES = process.env.JWT_EXPIRES_IN

    if (!JWT_EXPIRES || !JWT_SECRET)
      return NextResponse.json(
        {
          success: false,
          message: 'Variaveis de ambiente não foram carregadas devidamente',
        },
        { status: 400 },
      )

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        userName: user.name,
      },
      JWT_SECRET,
      {
        expiresIn: '1m',
      },
    )
    const response = NextResponse.json(
      {
        success: true,
        data: user,
        message: 'Token retornado com sucesso, usuário logado.',
      },
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )

    response.cookies.set({
      name: 'user',
      value: token,
      maxAge: 3600,
    })

    return response
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Request inválida.',
      },
      { status: 400 },
    )
  }
}
