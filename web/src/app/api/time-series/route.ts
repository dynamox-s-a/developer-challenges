import { type NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/database/mongoose'
import timeSeriesRepository from '@/lib/database/timeSeries/repository'
import {
  CreateTimeSeriesPointSchema,
  CreateTimeSeriesBatchSchema,
} from '@/types/zod/timeSeries'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    await dbConnect()

    const isArray = Array.isArray(body)
    const schema = isArray
      ? CreateTimeSeriesBatchSchema
      : CreateTimeSeriesPointSchema
    const validation = schema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.issues },
        { status: 400 },
      )
    }

    const result = await timeSeriesRepository.create(validation.data)

    return NextResponse.json(
      {
        success: true,
        message: isArray
          ? 'Dados de série temporal criados com sucesso'
          : 'Ponto de série temporal criado com sucesso',
        data: result,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno',
      },
      { status: 500 },
    )
  }
}
