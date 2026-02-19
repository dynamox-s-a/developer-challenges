import dbConnect from '@/lib/database/mongoose'
import monitoringPointRepository from '@/lib/database/monitoring_point/repository'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await dbConnect()
    const analysis = await monitoringPointRepository.getAllPopulate()
    console.log(analysis)
    if (!analysis.success) {
      return NextResponse.json(
        {
          success: false,
          message: analysis.message,
          data: analysis.data,
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      {
        success: true,
        message: analysis.message,
        data: analysis.data,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro na rota GET /api/monitoring-point/analysis:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor'
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        data: null,
      },
      { status: 500 }
    )
  }
}