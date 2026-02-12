import dbConnect from '@/lib/database/mongoose'
import monitoringPointRepository from '@/lib/database/monitoring_point/repository'
import { NextResponse } from 'next/server'

export async function GET() {
  await dbConnect()
  const analysis = await monitoringPointRepository.getAllPopulate()
  console.log(analysis)
  if (!analysis.success)
    return NextResponse.json(
      {
        success: false,
        message: analysis.message,
        data: analysis.data,
      },
      { status: 400 },
    )

  return NextResponse.json(
    {
      success: true,
      message: analysis.message,
      data: analysis.data,
    },
    { status: 200 },
  )
}
