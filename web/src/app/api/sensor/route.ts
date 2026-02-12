import dbConnect from '@/lib/database/mongoose'
import sensorRepository from '@/lib/database/sensor/repository'
import { CreateSensorSchema } from '@/types/zod/sensor'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  await dbConnect()
  const jsonData = await req.json()
  const parsed = CreateSensorSchema.safeParse(jsonData)
  if (!parsed.success)
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.message,
      },
      { status: 400 },
    )

  const result = await sensorRepository.create(parsed.data)
  if (!result.success)
    return NextResponse.json(
      {
        success: false,
        message: result.message,
      },
      { status: 400 },
    )

  return NextResponse.json(
    {
      success: true,
      message: result.message,
      data: result.data,
    },
    { status: 200 },
  )
}
