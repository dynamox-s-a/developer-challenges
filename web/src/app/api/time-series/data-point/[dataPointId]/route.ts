import { type NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/database/mongoose'
import timeSeriesRepository from '@/lib/database/timeSeries/repository'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ dataPointId: string }> },
) {
  try {
    await dbConnect()
    const { dataPointId } = await params

    const result = await timeSeriesRepository.delete(dataPointId)

    return NextResponse.json(
      {
        success: result,
        message: result ? 'Ponto deletado com sucesso' : 'Ponto não encontrado',
      },
      { status: result ? 200 : 404 },
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
