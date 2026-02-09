import { type NextRequest, NextResponse } from 'next/server'
import { loginRequestSchema } from '@/utils/zod.types'
import userRepository from '@/lib/database/user/repository'
import jwt from 'jsonwebtoken'
import { env } from '@/utils/env'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginRequestSchema.parse(body)
    const user = await userRepository.findByEmail(validatedData)

    if (!user)
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: 'Erro na autenticação do usuário.',
        },
        { status: 400 },
      )

    const JWT_SECRET = env.JWT_SECRET
    const JWT_EXPIRES = env.JWT_EXPIRES_IN

    if (!JWT_EXPIRES || !JWT_SECRET)
      return NextResponse.json(
        {
          success: false,
          data: null,
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
    console.log(user)

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
      maxAge: 60,
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
