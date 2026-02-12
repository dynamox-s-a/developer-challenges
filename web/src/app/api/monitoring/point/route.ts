/** biome-ignore-all lint/style/useTemplate: wtf */
import monitoringPointRepository from '@/lib/database/monitoring_point/repository'
import { CreateMonitoringPointSchema } from '@/types/zod/monitoring-point'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsedBody = CreateMonitoringPointSchema.safeParse(body)
  if (!parsedBody.success)
    return NextResponse.json(
      {
        success: false,
        message: 'Erro no parseamento dos dados ' + parsedBody.error.message,
      },
      { status: 400 },
    )

  const created = await monitoringPointRepository.create(parsedBody.data)
  if (!created.success)
    return NextResponse.json(
      {
        success: false,
        message: 'Erro na criação do ponto de monitoramento' + created.message,
      },
      { status: 400 },
    )

  return NextResponse.json(
    {
      success: true,
      message: 'Ponto de monitoramento criado com sucesso',
    },
    { status: 200 },
  )
}
