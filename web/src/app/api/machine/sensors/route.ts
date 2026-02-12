/** biome-ignore-all lint/style/useTemplate: idk*/
import dbConnect from '@/lib/database/mongoose'
import sensorRepository from '@/lib/database/sensor/repository'
import { NextResponse, type NextRequest } from 'next/server'
import z from 'zod'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const body = await req.json()

    console.log(body)

    const parsed = z.string().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID da máquina deve ser uma string: ' + parsed.error.message,
        },
        { status: 400 },
      )
    }

    const response = await sensorRepository.getMachineSensors(parsed.data)
    console.log(response)
    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          message: response.message || 'Erro ao buscar sensores',
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Dados recebidos com sucesso',
        data: response.data,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Erro na rota POST /api/sensor:', error)
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Erro interno do servidor',
      },
      { status: 500 },
    )
  }
}
