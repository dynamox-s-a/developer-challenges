import userRepository from '@/lib/database/user/repository'
import { registerRequestSchema } from '@/lib/http/auth/services/auth.types'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validateData = registerRequestSchema.parse(body)
    const user = await userRepository.create(validateData)

    console.log(user)

    if (user === null)
      return NextResponse.json(
        {
          success: false,
          message: 'Email já cadastrado.',
        },
        { status: 400 },
      )

    return NextResponse.json(
      {
        success: true,
        message: 'Usuário cadastrado com sucesso.',
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Falha no cadastro do usuário, tente novamente mais tarde.',
      },
      { status: 400 },
    )
  }
}
