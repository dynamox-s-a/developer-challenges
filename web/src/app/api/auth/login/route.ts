import { type NextRequest, NextResponse } from 'next/server'
import { loginRequestSchema, type loginResponse } from '@/lib/http/auth/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validatedData = loginRequestSchema.parse(body)
    console.log(validatedData)
    // fazer a verificação aqui, lul
    // enviar para a API
    // receber retorno do token!!
    const returnedData: loginResponse = {
      id: '1234',
      name: 'NomeFicticio',
      email: validatedData.email,
      token: 'TokenFicticio',
    }

    const response = NextResponse.json(
      {
        success: true,
        data: returnedData,
        message: 'Token retornado com sucesso, usuário logado.',
      },
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )

    response.cookies.set({
      name: 'user',
      value: returnedData.token,
      maxAge: 360,
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
