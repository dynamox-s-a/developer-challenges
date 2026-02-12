/** biome-ignore-all lint/style/useTemplate: idk */
import machineRepository from '@/lib/database/machine/repository'
import dbConnect from '@/lib/database/mongoose'
import { UpdateMachineSchema } from '@/types/zod/machine'
import { type NextRequest, NextResponse } from 'next/server'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await dbConnect()
  const body = await req.json()
  const { id } = await params
  const parsed = UpdateMachineSchema.safeParse(body)

  if (!parsed.success)
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao parsear a requisição: ' + parsed.error.message,
      },
      { status: 400 },
    )

  const updated = await machineRepository.update(id, parsed.data)
  if (!updated.success)
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao atualizar maquina ',
      },
      { status: 400 },
    )

  return NextResponse.json(
    {
      success: true,
      message: 'Maquina atualizada com sucesso',
    },
    { status: 200 },
  )
}
