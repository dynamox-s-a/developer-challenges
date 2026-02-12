import { type NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/database/mongoose'
import timeSeriesRepository from '@/lib/database/timeSeries/repository'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ monitoringPointId: string }> },
) {
  try {
    await dbConnect()
    const { monitoringPointId } = await params
    const count = await timeSeriesRepository.getCount(monitoringPointId)

    return NextResponse.json(
      {
        success: true,
        message: 'Contagem obtida com sucesso',
        data: { count },
      },
      { status: 200 },
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
