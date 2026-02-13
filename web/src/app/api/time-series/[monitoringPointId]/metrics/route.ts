// app/api/time-series/[monitoringPointId]/metrics/route.ts
import { type NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/database/mongoose'
import timeSeriesRepository from '@/lib/database/timeSeries/repository'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ monitoringPointId: string }> },
) {
  try {
    await dbConnect()
    const param = await params

    const metrics = await timeSeriesRepository.getMetrics(
      param.monitoringPointId,
    )

    return NextResponse.json(
      {
        success: true,
        message: 'Métricas calculadas com sucesso',
        data: metrics,
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
