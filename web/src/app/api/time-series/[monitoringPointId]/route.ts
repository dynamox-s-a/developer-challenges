import { type NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/database/mongoose'
import timeSeriesRepository from '@/lib/database/timeSeries/repository'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ monitoringPointId: string }> },
) {
  try {
    await dbConnect()
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page')) || 0
    const pageSize = Number(searchParams.get('pageSize')) || 50
    const { monitoringPointId } = await params

    const result = await timeSeriesRepository.getByMonitoringPoint(
      monitoringPointId,
      page,
      pageSize,
    )

    return NextResponse.json(
      {
        success: true,
        message: 'Dados recuperados com sucesso',
        data: result,
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ monitoringPointId: string }> },
) {
  try {
    await dbConnect()

    const { monitoringPointId } = await params

    await timeSeriesRepository.deleteAllByMonitoringPoint(monitoringPointId)

    return NextResponse.json(
      { success: true, message: 'Todos os pontos foram deletados' },
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
